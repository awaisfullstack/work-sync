"use client";

import { useState } from "react";
import { Loader2, MoreVertical, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

import { formatDateTime } from "@/lib/utils/formatDate";
import { formatApiError } from "@/lib/utils/formatError";
import { Role } from "@/enums";
import { useAppSelector } from "@/store/hooks";

import {
  useAddTaskCommentMutation,
  useDeleteTaskCommentMutation,
  useGetTaskCommentsQuery,
} from "../tasksApi";
import { getInitials } from "@/lib/utils/index";

interface TaskCommentsCardProps {
  taskId: string;
}

export function TaskCommentsCard({ taskId }: TaskCommentsCardProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [comment, setComment] = useState("");

  const { data, isLoading, isFetching } = useGetTaskCommentsQuery(taskId);

  const [addComment, { isLoading: isAdding }] = useAddTaskCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] =
    useDeleteTaskCommentMutation();

  const comments = data?.data ?? [];

  async function handleAddComment() {
    if (!comment.trim()) return;

    try {
      const res = await addComment({
        taskId,
        comment: comment.trim(),
      }).unwrap();

      setComment("");
      toast.success(res.message);
    } catch (error) {
      const message = formatApiError(error);
      toast.error(message);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      const res = await deleteComment({
        taskId,
        commentId,
      }).unwrap();
      toast.success(res.message);
    } catch (error) {
      const message = formatApiError(error);
      toast.error(message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-3">
          <Textarea
            rows={4}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Write a comment about this task..."
          />

          <div className="flex justify-end mb-3">
            <Button
              onClick={handleAddComment}
              disabled={isAdding || !comment.trim()}
            >
              {isAdding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Add Comment
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {isLoading || isFetching ? (
            <p className="text-sm text-muted-foreground">Loading comments...</p>
          ) : comments.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm font-medium">No comments yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add the first comment for this task.
              </p>
            </div>
          ) : (
            comments.map((item) => {
              const canDeleteComment =
                currentUser?.role === Role.ADMIN ||
                item.userId === currentUser?.id;

              return (
                <div key={item.id} className="flex gap-3 rounded-lg border p-4">
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(item.user?.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {item.user?.name ?? "Unknown User"}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(item.createdAt)}
                        </p>
                      </div>

                      {canDeleteComment && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              disabled={isDeleting}
                              className="text-red-600"
                              onClick={() => handleDeleteComment(item.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    <p className="mt-3 whitespace-pre-line text-sm text-slate-700">
                      {item.comment}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
