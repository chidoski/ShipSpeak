import { uploadService } from '../../../services/upload.service';
import { supabase } from '../../../../../packages/database/supabase';

// Mock Supabase
jest.mock('../../../../../packages/database/supabase', () => ({
  supabase: {
    from: jest.fn(),
    storage: {
      from: jest.fn(),
      createBucket: jest.fn()
    }
  }
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('UploadService', () => {
  const userId = 'test-user-id';
  const mockFileMetadata = {
    originalFilename: 'test-audio.mp3',
    fileSize: 1024000,
    mimeType: 'audio/mp3',
    sanitizedFilename: 'test-audio.mp3',
    storagePath: 'audio/test-user/2024-01-01/test-audio.mp3',
    uploadedAt: '2024-01-01T10:00:00.000Z',
    userId
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveFileMetadata', () => {
    it('should save file metadata successfully', async () => {
      const mockMeeting = {
        id: 'meeting-123',
        user_id: userId,
        title: 'test-audio.mp3',
        original_filename: 'test-audio.mp3',
        file_size_bytes: 1024000,
        file_format: 'audio/mp3',
        storage_path: 'audio/test-user/2024-01-01/test-audio.mp3',
        status: 'uploaded'
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockMeeting,
              error: null
            })
          })
        })
      } as any);

      const result = await uploadService.saveFileMetadata(userId, mockFileMetadata);

      expect(result.success).toBe(true);
      expect(result.meetingId).toBe('meeting-123');
      expect(result.storagePath).toBe(mockFileMetadata.storagePath);
    });

    it('should handle database errors', async () => {
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database connection failed' }
            })
          })
        })
      } as any);

      const result = await uploadService.saveFileMetadata(userId, mockFileMetadata);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to save meeting record');
    });

    it('should save with meeting metadata', async () => {
      const meetingMetadata = {
        title: 'Executive Review Meeting',
        meetingType: 'executive_review',
        participantCount: 5,
        durationSeconds: 3600
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'meeting-123' },
              error: null
            })
          })
        })
      } as any);

      const result = await uploadService.saveFileMetadata(userId, mockFileMetadata, meetingMetadata);

      expect(result.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('meetings');
    });
  });

  describe('uploadToSupabaseStorage', () => {
    const fileBuffer = Buffer.from('audio file content');
    const uploadMetadata = {
      originalFilename: 'test-audio.mp3',
      sanitizedFilename: 'test-audio.mp3',
      mimeType: 'audio/mp3'
    };

    it('should upload file successfully', async () => {
      const mockStorageResponse = {
        data: { path: 'audio/test-user/2024-01-01/test-audio.mp3' },
        error: null
      };

      mockSupabase.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue(mockStorageResponse)
      } as any);

      const result = await uploadService.uploadToSupabaseStorage(userId, fileBuffer, uploadMetadata);

      expect(result.success).toBe(true);
      expect(result.storagePath).toBe('audio/test-user/2024-01-01/test-audio.mp3');
    });

    it('should create bucket if not found and retry upload', async () => {
      const bucketNotFoundError = { message: 'Bucket not found' };
      const retrySuccessResponse = {
        data: { path: 'audio/test-user/2024-01-01/test-audio.mp3' },
        error: null
      };

      mockSupabase.storage.from.mockReturnValue({
        upload: jest.fn()
          .mockResolvedValueOnce({ data: null, error: bucketNotFoundError })
          .mockResolvedValueOnce(retrySuccessResponse)
      } as any);

      mockSupabase.storage.createBucket.mockResolvedValue({ error: null } as any);

      const result = await uploadService.uploadToSupabaseStorage(userId, fileBuffer, uploadMetadata);

      expect(result.success).toBe(true);
      expect(mockSupabase.storage.createBucket).toHaveBeenCalledWith('audio-files', {
        public: false,
        allowedMimeTypes: ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/m4a', 'audio/webm'],
        fileSizeLimit: 100 * 1024 * 1024
      });
    });

    it('should handle upload errors', async () => {
      const uploadError = { message: 'Storage service unavailable' };

      mockSupabase.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue({ data: null, error: uploadError })
      } as any);

      const result = await uploadService.uploadToSupabaseStorage(userId, fileBuffer, uploadMetadata);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Upload failed');
    });

    it('should handle bucket creation errors', async () => {
      const bucketNotFoundError = { message: 'Bucket not found' };
      const bucketCreationError = { message: 'Insufficient permissions' };

      mockSupabase.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue({ data: null, error: bucketNotFoundError })
      } as any);

      mockSupabase.storage.createBucket.mockResolvedValue({ error: bucketCreationError } as any);

      const result = await uploadService.uploadToSupabaseStorage(userId, fileBuffer, uploadMetadata);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to create storage bucket');
    });
  });

  describe('generateSignedUrl', () => {
    const storagePath = 'audio/test-user/2024-01-01/test-audio.mp3';

    it('should generate signed URL successfully', async () => {
      const mockSignedUrlResponse = {
        data: { signedUrl: 'https://storage.supabase.co/signed-url' },
        error: null
      };

      mockSupabase.storage.from.mockReturnValue({
        createSignedUrl: jest.fn().mockResolvedValue(mockSignedUrlResponse)
      } as any);

      const result = await uploadService.generateSignedUrl(storagePath, 3600);

      expect(result.success).toBe(true);
      expect(result.signedUrl).toBe('https://storage.supabase.co/signed-url');
    });

    it('should handle signed URL generation errors', async () => {
      const signedUrlError = { message: 'File not found' };

      mockSupabase.storage.from.mockReturnValue({
        createSignedUrl: jest.fn().mockResolvedValue({ data: null, error: signedUrlError })
      } as any);

      const result = await uploadService.generateSignedUrl(storagePath);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to generate signed URL');
    });

    it('should use default expiration time', async () => {
      const mockSignedUrlResponse = {
        data: { signedUrl: 'https://storage.supabase.co/signed-url' },
        error: null
      };

      const mockCreateSignedUrl = jest.fn().mockResolvedValue(mockSignedUrlResponse);
      mockSupabase.storage.from.mockReturnValue({
        createSignedUrl: mockCreateSignedUrl
      } as any);

      await uploadService.generateSignedUrl(storagePath);

      expect(mockCreateSignedUrl).toHaveBeenCalledWith(storagePath, 3600);
    });
  });

  describe('updateMeetingStatus', () => {
    const meetingId = 'meeting-123';

    it('should update meeting status successfully', async () => {
      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null })
        })
      } as any);

      const result = await uploadService.updateMeetingStatus(meetingId, 'processing');

      expect(result.success).toBe(true);
    });

    it('should handle update errors', async () => {
      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: { message: 'Meeting not found' } })
        })
      } as any);

      const result = await uploadService.updateMeetingStatus(meetingId, 'failed', 'Processing error');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to update meeting status');
    });
  });

  describe('getMeetingById', () => {
    const meetingId = 'meeting-123';

    it('should get meeting successfully', async () => {
      const mockMeeting = {
        id: meetingId,
        user_id: userId,
        title: 'Test Meeting',
        status: 'uploaded'
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockMeeting,
                error: null
              })
            })
          })
        })
      } as any);

      const result = await uploadService.getMeetingById(meetingId, userId);

      expect(result.success).toBe(true);
      expect(result.meeting).toEqual(mockMeeting);
    });

    it('should handle meeting not found', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' }
              })
            })
          })
        })
      } as any);

      const result = await uploadService.getMeetingById(meetingId, userId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Meeting not found');
    });

    it('should handle database errors', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database connection failed' }
              })
            })
          })
        })
      } as any);

      const result = await uploadService.getMeetingById(meetingId, userId);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to fetch meeting');
    });
  });

  describe('deleteFile', () => {
    const meetingId = 'meeting-123';

    it('should delete file and meeting successfully', async () => {
      const mockMeeting = {
        id: meetingId,
        user_id: userId,
        storage_path: 'audio/test-user/2024-01-01/test-audio.mp3'
      };

      // Mock getMeetingById
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockMeeting,
                error: null
              })
            })
          })
        })
      } as any);

      // Mock storage delete
      mockSupabase.storage.from.mockReturnValue({
        remove: jest.fn().mockResolvedValue({ error: null })
      } as any);

      // Mock database delete
      mockSupabase.from.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null })
          })
        })
      } as any);

      const result = await uploadService.deleteFile(meetingId, userId);

      expect(result.success).toBe(true);
    });

    it('should handle meeting not found', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' }
              })
            })
          })
        })
      } as any);

      const result = await uploadService.deleteFile(meetingId, userId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Meeting not found');
    });

    it('should continue deletion even if storage delete fails', async () => {
      const mockMeeting = {
        id: meetingId,
        user_id: userId,
        storage_path: 'audio/test-user/2024-01-01/test-audio.mp3'
      };

      // Mock getMeetingById
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockMeeting,
                error: null
              })
            })
          })
        })
      } as any);

      // Mock storage delete failure
      mockSupabase.storage.from.mockReturnValue({
        remove: jest.fn().mockResolvedValue({ error: { message: 'File not found in storage' } })
      } as any);

      // Mock database delete success
      mockSupabase.from.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null })
          })
        })
      } as any);

      const result = await uploadService.deleteFile(meetingId, userId);

      expect(result.success).toBe(true);
    });
  });

  describe('getUserUploadStats', () => {
    it('should get user upload statistics', async () => {
      const mockMeetings = [
        {
          id: 'meeting-1',
          user_id: userId,
          status: 'uploaded',
          file_size_bytes: 1024000,
          created_at: '2024-01-01T10:00:00Z'
        },
        {
          id: 'meeting-2',
          user_id: userId,
          status: 'analyzed',
          file_size_bytes: 2048000,
          created_at: '2024-01-02T10:00:00Z'
        }
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockMeetings,
              error: null
            })
          })
        })
      } as any);

      const result = await uploadService.getUserUploadStats(userId);

      expect(result.success).toBe(true);
      expect(result.stats?.totalUploads).toBe(2);
      expect(result.stats?.totalSize).toBe(3072000);
      expect(result.stats?.uploadsByStatus).toEqual({
        uploaded: 1,
        analyzed: 1
      });
      expect(result.stats?.recentUploads).toHaveLength(2);
    });

    it('should handle empty results', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: [],
              error: null
            })
          })
        })
      } as any);

      const result = await uploadService.getUserUploadStats(userId);

      expect(result.success).toBe(true);
      expect(result.stats?.totalUploads).toBe(0);
      expect(result.stats?.totalSize).toBe(0);
    });
  });

  describe('cleanupOrphanedFiles', () => {
    it('should cleanup orphaned files successfully', async () => {
      const mockFailedMeetings = [
        {
          id: 'meeting-failed-1',
          storage_path: 'audio/test-user/2024-01-01/failed-audio.mp3',
          created_at: '2023-12-31T10:00:00Z'
        }
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            not: jest.fn().mockReturnValue({
              lt: jest.fn().mockResolvedValue({
                data: mockFailedMeetings,
                error: null
              })
            })
          })
        })
      } as any);

      // Mock storage delete
      mockSupabase.storage.from.mockReturnValue({
        remove: jest.fn().mockResolvedValue({ error: null })
      } as any);

      // Mock database delete
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null })
        })
      } as any);

      const result = await uploadService.cleanupOrphanedFiles();

      expect(result.success).toBe(true);
      expect(result.cleaned?.orphanedFiles).toBe(1);
      expect(result.cleaned?.failedUploads).toBe(1);
    });

    it('should handle cleanup errors gracefully', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            not: jest.fn().mockReturnValue({
              lt: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Query failed' }
              })
            })
          })
        })
      } as any);

      const result = await uploadService.cleanupOrphanedFiles();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to query failed uploads');
    });
  });
});