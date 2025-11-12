import { supabase } from '../../../packages/database/supabase';
import { Meeting, MeetingInsert, MeetingUpdate } from '../../../packages/database/types';
import { ApiError, ApiErrorCode } from '../types/api';

export interface FileUploadMetadata {
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  sanitizedFilename: string;
  storagePath: string;
  uploadedAt: string;
  userId: string;
}

export interface UploadServiceResult {
  success: boolean;
  fileId?: string;
  storagePath?: string;
  meetingId?: string;
  error?: string;
}

export class UploadService {
  /**
   * Save file metadata to database after successful upload
   */
  async saveFileMetadata(
    userId: string,
    metadata: FileUploadMetadata,
    meetingMetadata?: {
      title?: string;
      meetingType?: string;
      participantCount?: number;
      durationSeconds?: number;
    }
  ): Promise<UploadServiceResult> {
    try {
      // Create meeting record with file metadata
      const meetingData: MeetingInsert = {
        user_id: userId,
        title: meetingMetadata?.title || metadata.sanitizedFilename,
        meeting_type: (meetingMetadata?.meetingType as any) || 'other',
        duration_seconds: meetingMetadata?.durationSeconds,
        participant_count: meetingMetadata?.participantCount,
        original_filename: metadata.originalFilename,
        file_size_bytes: metadata.fileSize,
        file_format: metadata.mimeType,
        storage_path: metadata.storagePath,
        status: 'uploaded',
        has_consent: true,
        consent_participants: []
      };

      const { data: meeting, error } = await supabase
        .from('meetings')
        .insert([meetingData])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save meeting record: ${error.message}`);
      }

      return {
        success: true,
        meetingId: meeting.id,
        storagePath: metadata.storagePath,
        fileId: meeting.id
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Upload file to Supabase storage
   */
  async uploadToSupabaseStorage(
    userId: string,
    file: Buffer,
    metadata: {
      originalFilename: string;
      sanitizedFilename: string;
      mimeType: string;
    }
  ): Promise<{ success: boolean; storagePath?: string; error?: string }> {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const storagePath = `audio/${userId}/${timestamp}/${metadata.sanitizedFilename}`;

      const { data, error } = await supabase.storage
        .from('audio-files')
        .upload(storagePath, file, {
          contentType: metadata.mimeType,
          upsert: false
        });

      if (error) {
        // Check if bucket exists, create if not
        if (error.message.includes('not found')) {
          const { error: bucketError } = await supabase.storage.createBucket('audio-files', {
            public: false,
            allowedMimeTypes: ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/m4a', 'audio/webm'],
            fileSizeLimit: 100 * 1024 * 1024 // 100MB
          });

          if (bucketError) {
            throw new Error(`Failed to create storage bucket: ${bucketError.message}`);
          }

          // Retry upload
          const { data: retryData, error: retryError } = await supabase.storage
            .from('audio-files')
            .upload(storagePath, file, {
              contentType: metadata.mimeType,
              upsert: false
            });

          if (retryError) {
            throw new Error(`Upload retry failed: ${retryError.message}`);
          }

          return {
            success: true,
            storagePath: retryData.path
          };
        }

        throw new Error(`Upload failed: ${error.message}`);
      }

      return {
        success: true,
        storagePath: data.path
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate signed URL for file access
   */
  async generateSignedUrl(
    storagePath: string,
    expiresIn: number = 3600
  ): Promise<{ success: boolean; signedUrl?: string; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from('audio-files')
        .createSignedUrl(storagePath, expiresIn);

      if (error) {
        throw new Error(`Failed to generate signed URL: ${error.message}`);
      }

      return {
        success: true,
        signedUrl: data.signedUrl
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update meeting status
   */
  async updateMeetingStatus(
    meetingId: string,
    status: 'uploaded' | 'processing' | 'analyzed' | 'failed',
    errorMessage?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: MeetingUpdate = {
        status,
        error_message: errorMessage,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('meetings')
        .update(updateData)
        .eq('id', meetingId);

      if (error) {
        throw new Error(`Failed to update meeting status: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get meeting by ID with ownership check
   */
  async getMeetingById(
    meetingId: string,
    userId: string
  ): Promise<{ success: boolean; meeting?: Meeting; error?: string }> {
    try {
      const { data: meeting, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', meetingId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            success: false,
            error: 'Meeting not found'
          };
        }
        throw new Error(`Failed to fetch meeting: ${error.message}`);
      }

      return {
        success: true,
        meeting
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete file from storage and database
   */
  async deleteFile(
    meetingId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get meeting to check ownership and get storage path
      const { success, meeting, error: getError } = await this.getMeetingById(meetingId, userId);
      
      if (!success || !meeting) {
        return {
          success: false,
          error: getError || 'Meeting not found'
        };
      }

      // Delete from storage if path exists
      if (meeting.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('audio-files')
          .remove([meeting.storage_path]);

        if (storageError) {
          console.warn(`Warning: Failed to delete file from storage: ${storageError.message}`);
        }
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId)
        .eq('user_id', userId);

      if (dbError) {
        throw new Error(`Failed to delete meeting record: ${dbError.message}`);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get user's upload statistics
   */
  async getUserUploadStats(userId: string): Promise<{
    success: boolean;
    stats?: {
      totalUploads: number;
      totalSize: number;
      uploadsByStatus: Record<string, number>;
      recentUploads: Meeting[];
    };
    error?: string;
  }> {
    try {
      const { data: meetings, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch user uploads: ${error.message}`);
      }

      const stats = {
        totalUploads: meetings.length,
        totalSize: meetings.reduce((sum, meeting) => sum + (meeting.file_size_bytes || 0), 0),
        uploadsByStatus: meetings.reduce((acc, meeting) => {
          acc[meeting.status] = (acc[meeting.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        recentUploads: meetings.slice(0, 10)
      };

      return {
        success: true,
        stats
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Clean up expired upload sessions and orphaned files
   */
  async cleanupOrphanedFiles(): Promise<{
    success: boolean;
    cleaned?: {
      orphanedFiles: number;
      failedUploads: number;
    };
    error?: string;
  }> {
    try {
      // Find meetings with storage paths but failed status older than 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data: failedMeetings, error: queryError } = await supabase
        .from('meetings')
        .select('*')
        .eq('status', 'failed')
        .not('storage_path', 'is', null)
        .lt('created_at', oneDayAgo);

      if (queryError) {
        throw new Error(`Failed to query failed uploads: ${queryError.message}`);
      }

      let cleanedFiles = 0;
      let cleanedRecords = 0;

      for (const meeting of failedMeetings) {
        if (meeting.storage_path) {
          // Delete file from storage
          const { error: storageError } = await supabase.storage
            .from('audio-files')
            .remove([meeting.storage_path]);

          if (!storageError) {
            cleanedFiles++;
          }

          // Delete database record
          const { error: dbError } = await supabase
            .from('meetings')
            .delete()
            .eq('id', meeting.id);

          if (!dbError) {
            cleanedRecords++;
          }
        }
      }

      return {
        success: true,
        cleaned: {
          orphanedFiles: cleanedFiles,
          failedUploads: cleanedRecords
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const uploadService = new UploadService();