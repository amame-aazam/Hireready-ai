import { useState, useEffect, useRef, useCallback } from 'react';
import { assessmentApi, AttemptAnswers } from '../api/assessmentApi';

interface UseAutosaveProps {
  attemptId: string;
  answers: AttemptAnswers;
  isEnabled: boolean;
  intervalMs?: number;
}

export const useAutosave = ({
  attemptId,
  answers,
  isEnabled,
  intervalMs = 10000,
}: UseAutosaveProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const answersRef = useRef(answers);
  answersRef.current = answers;

  const lastSavedJsonRef = useRef<string>(JSON.stringify(answers));

  const saveNow = useCallback(async () => {
    if (!isEnabled || !attemptId) return;

    const currentJson = JSON.stringify(answersRef.current);
    if (currentJson === lastSavedJsonRef.current) {
      // Nothing changed
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      const res = await assessmentApi.autosave(attemptId, answersRef.current);
      lastSavedJsonRef.current = currentJson;
      setLastSavedAt(new Date(res.savedAt));
    } catch (err: any) {
      setSaveError(err.response?.data?.message || 'Autosave failed');
    } finally {
      setIsSaving(false);
    }
  }, [attemptId, isEnabled]);

  // Periodic autosave interval
  useEffect(() => {
    if (!isEnabled) return;

    const timer = setInterval(() => {
      saveNow();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isEnabled, intervalMs, saveNow]);

  return {
    isSaving,
    lastSavedAt,
    saveError,
    saveNow,
  };
};
