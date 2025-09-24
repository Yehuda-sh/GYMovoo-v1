/**
 * @file src/features/workout/components/ExerciseDetailsModal.tsx
 * @brief Exercise details modal - extracted from WorkoutPlansScreen
 * Specialized modal for displaying exercise information
 */

import React from "react";
import ConfirmationModal from "../../../components/common/ConfirmationModal";

interface ExerciseLite {
  id?: string;
  name?: string;
}

interface ExerciseDetailsModalProps {
  visible: boolean;
  selectedExercise: ExerciseLite | null;
  exerciseDetails: string;
  onClose: () => void;
}

const ExerciseDetailsModal: React.FC<ExerciseDetailsModalProps> = ({
  visible,
  selectedExercise,
  exerciseDetails,
  onClose,
}) => {
  return (
    <ConfirmationModal
      visible={visible}
      title={selectedExercise?.name || "פרטי תרגיל"}
      message={exerciseDetails}
      onClose={onClose}
      onConfirm={onClose}
      singleButton
      confirmText="סגור"
      variant="default"
    />
  );
};

export default ExerciseDetailsModal;
