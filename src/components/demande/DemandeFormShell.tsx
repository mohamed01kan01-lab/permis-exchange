"use client";

import { useEffect, useReducer, useRef } from "react";
import { useTranslations } from "next-intl";
import { StepIndicator } from "./StepIndicator";
import { Step1Identity } from "./Step1Identity";
import { Step2Licence } from "./Step2Licence";
import { Step3Destination } from "./Step3Destination";
import { Step4Documents } from "./Step4Documents";
import { Step5Review } from "./Step5Review";
import type { IdentityData } from "@/lib/validation/identity.schema";
import type { LicenceData } from "@/lib/validation/licence.schema";
import type { DestinationData } from "@/lib/validation/destination.schema";
import type { UploadedDocument } from "@/lib/validation/documents.schema";

type FormData = Partial<
  IdentityData & LicenceData & DestinationData & { documents: UploadedDocument[] }
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

export function DemandeFormShell() {
  const t = useTranslations("demande.steps");
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
          <Step1Identity
            defaultValues={state.data}
            onComplete={(values) =>
              dispatch({ type: "COMPLETE_STEP", payload: values })
            }
          />
        )}

        {state.step === 2 && (
          <Step2Licence
            defaultValues={state.data}
            onComplete={(values) =>
              dispatch({ type: "COMPLETE_STEP", payload: values })
            }
            onBack={() => dispatch({ type: "BACK" })}
          />
        )}

        {state.step === 3 && (
          <Step3Destination
            licenceIssuingCountry={state.data.licenceIssuingCountry}
            defaultValues={state.data}
            onComplete={(values) =>
              dispatch({ type: "COMPLETE_STEP", payload: values })
            }
            onBack={() => dispatch({ type: "BACK" })}
          />
        )}

        {state.step === 4 && (
          <Step4Documents
            defaultValues={state.data.documents}
            needsTranslation={state.data.procedureType === "NON_EU_CONVERSION"}
            onComplete={(documents) =>
              dispatch({ type: "COMPLETE_STEP", payload: { documents } })
            }
            onBack={() => dispatch({ type: "BACK" })}
          />
        )}

        {state.step === 5 &&
          state.data.firstName &&
          state.data.licenceIssuingCountry &&
          state.data.destinationCountry &&
          state.data.documents && (
            <Step5Review
              data={
                state.data as IdentityData &
                  LicenceData &
                  DestinationData & { documents: UploadedDocument[] }
              }
              onBack={() => dispatch({ type: "BACK" })}
            />
          )}
      </div>
    </div>
  );
}
