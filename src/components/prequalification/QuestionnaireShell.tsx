"use client";

import { useEffect, useReducer, useRef } from "react";
import { useTranslations } from "next-intl";
import { StepIndicator } from "@/components/demande/StepIndicator";
import { StepLicence } from "./StepLicence";
import { StepResidency } from "./StepResidency";
import { StepHistory } from "./StepHistory";
import { StepContact } from "./StepContact";
import { StepReview } from "./StepReview";
import type {
  LicenceStepData,
  ResidencyStepData,
  HistoryStepData,
  ContactStepData,
} from "@/lib/validation/prequalification.schema";

type FormData = Partial<
  LicenceStepData & ResidencyStepData & HistoryStepData & ContactStepData
>;

type State = {
  step: number;
  data: FormData;
};

type Action =
  | { type: "COMPLETE_STEP"; payload: Partial<FormData> }
  | { type: "GO_TO_STEP"; step: number }
  | { type: "BACK" };

const TOTAL_STEPS = 5;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "COMPLETE_STEP":
      return {
        step: Math.min(state.step + 1, TOTAL_STEPS),
        data: { ...state.data, ...action.payload },
      };
    case "GO_TO_STEP":
      return { ...state, step: action.step };
    case "BACK":
      return { ...state, step: Math.max(1, state.step - 1) };
    default:
      return state;
  }
}

export function QuestionnaireShell() {
  const t = useTranslations("questionnaire.steps");
  const [state, dispatch] = useReducer(reducer, { step: 1, data: {} });
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [state.step]);

  const stepLabels = [t("1"), t("2"), t("3"), t("4"), t("5")];

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <StepIndicator
        steps={stepLabels}
        current={state.step}
        onNavigate={(step) => dispatch({ type: "GO_TO_STEP", step })}
      />

      <h1
        ref={headingRef}
        tabIndex={-1}
        aria-live="polite"
        className="mt-8 text-2xl font-bold text-foreground outline-none sm:text-3xl"
      >
        {stepLabels[state.step - 1]}
      </h1>

      <div className="mt-8">
        {state.step === 1 && (
          <StepLicence
            defaultValues={state.data}
            onComplete={(values) => dispatch({ type: "COMPLETE_STEP", payload: values })}
          />
        )}

        {state.step === 2 && (
          <StepResidency
            defaultValues={state.data}
            onComplete={(values) => dispatch({ type: "COMPLETE_STEP", payload: values })}
            onBack={() => dispatch({ type: "BACK" })}
          />
        )}

        {state.step === 3 && (
          <StepHistory
            defaultValues={state.data}
            onComplete={(values) => dispatch({ type: "COMPLETE_STEP", payload: values })}
            onBack={() => dispatch({ type: "BACK" })}
          />
        )}

        {state.step === 4 && (
          <StepContact
            defaultValues={state.data}
            onComplete={(values) => dispatch({ type: "COMPLETE_STEP", payload: values })}
            onBack={() => dispatch({ type: "BACK" })}
          />
        )}

        {state.step === 5 &&
          state.data.licenceIssuingCountry &&
          state.data.firstName && (
            <StepReview
              data={
                state.data as LicenceStepData &
                  ResidencyStepData &
                  HistoryStepData &
                  ContactStepData
              }
              onBack={() => dispatch({ type: "BACK" })}
            />
          )}
      </div>
    </div>
  );
}
