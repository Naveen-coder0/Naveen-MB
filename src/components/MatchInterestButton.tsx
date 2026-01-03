import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MatchInterestButtonProps {
  fromUserId: string;
  toUserId: string;
  toUserName: string;
  toUserEmail: string;
  fromUserName: string;
  existingInterest?: { id: string; status: string } | null;
}

const MatchInterestButton = ({
  fromUserId,
  toUserId,
  toUserName,
  toUserEmail,
  fromUserName,
  existingInterest,
}: MatchInterestButtonProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendInterest = async () => {
    setIsSending(true);

    try {
      // Insert match interest
      const { error: interestError } = await supabase
        .from("match_interests")
        .insert({
          from_user_id: fromUserId,
          to_user_id: toUserId,
          message: message || null,
          status: "pending",
        });

      if (interestError) throw interestError;

      // Create notification
      const { error: notifError } = await supabase.from("notifications").insert({
        user_id: toUserId,
        type: "match_interest",
        title: "New Match Interest",
        message: `${fromUserName} is interested in connecting with you!`,
        metadata: { from_user_id: fromUserId, from_user_name: fromUserName },
      });

      if (notifError) console.error("Failed to create notification:", notifError);

      // Send email notification
      try {
        await supabase.functions.invoke("send-notification-email", {
          body: {
            to: toUserEmail,
            type: "match_interest",
            recipientName: toUserName,
            senderName: fromUserName,
            message: message || null,
          },
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }

      toast({
        title: "Interest sent!",
        description: `Your interest has been sent to ${toUserName}`,
      });

      setIsOpen(false);
      setMessage("");
    } catch (error: any) {
      console.error("Error sending interest:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send interest",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (existingInterest) {
    const statusColors: Record<string, string> = {
      pending: "bg-amber-100 text-amber-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          statusColors[existingInterest.status] || statusColors.pending
        }`}
      >
        <Heart className="h-4 w-4" />
        Interest {existingInterest.status}
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-primary to-rose-dark hover:opacity-90">
          <Heart className="h-4 w-4" />
          Express Interest
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">Express Interest</DialogTitle>
          <DialogDescription>
            Send a message to {toUserName} to express your interest in connecting
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Write a personal message (optional)..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendInterest} disabled={isSending} className="gap-2">
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Interest
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MatchInterestButton;
