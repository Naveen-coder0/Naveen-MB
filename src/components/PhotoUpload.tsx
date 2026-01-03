import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  currentPhotoUrl: string | null;
  userId: string;
  onPhotoUpdated: (url: string) => void;
}

const PhotoUpload = ({ currentPhotoUrl, userId, onPhotoUpdated }: PhotoUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Delete old photo if exists
      if (currentPhotoUrl) {
        const oldPath = currentPhotoUrl.split("/profile-photos/")[1];
        if (oldPath) {
          await supabase.storage.from("profile-photos").remove([oldPath]);
        }
      }

      // Upload new photo
      const { data, error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(data.path);

      // Update profile with new photo URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_photo: publicUrl })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      setPreviewUrl(publicUrl);
      onPhotoUpdated(publicUrl);

      toast({
        title: "Photo uploaded",
        description: "Your profile photo has been updated successfully",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!currentPhotoUrl) return;

    setIsUploading(true);

    try {
      const oldPath = currentPhotoUrl.split("/profile-photos/")[1];
      if (oldPath) {
        await supabase.storage.from("profile-photos").remove([oldPath]);
      }

      const { error } = await supabase
        .from("profiles")
        .update({ profile_photo: null })
        .eq("user_id", userId);

      if (error) throw error;

      setPreviewUrl(null);
      onPhotoUpdated("");

      toast({
        title: "Photo removed",
        description: "Your profile photo has been removed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border overflow-hidden group">
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleRemovePhoto}
                disabled={isUploading}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <Camera className="h-8 w-8 text-muted-foreground" />
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {previewUrl ? "Change Photo" : "Upload Photo"}
        </Button>
        <p className="text-xs text-muted-foreground">Max 5MB, JPG/PNG</p>
      </div>
    </div>
  );
};

export default PhotoUpload;
