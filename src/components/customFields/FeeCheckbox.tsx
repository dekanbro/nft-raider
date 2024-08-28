import { WrappedCheckbox, Buildable, Field } from "@daohaus/ui";

export const FeeCheckbox = (props: Buildable<Field>) => {
  return (
    <WrappedCheckbox
      checkboxes={[
        {
          defaultChecked: false,
          disabled: false,
          name: "feeCheckbox",
          required: true,
          title: "Remove 1% OSS fee. I support OSS in other ways.",
        },
      ]}
      // label="Disclaimer"
      {...props}
    />
  );
};
