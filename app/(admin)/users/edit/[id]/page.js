import React from "react";
import Page from "@/app/(admin)/partial/Page";
import SectionTitle from "@/app/(admin)/partial/SectionTitle";
import Form from "../../partial/Form";

export default function CreateUser() {
  return (
    <Page title={"Update User"}>
      <div className="box-section">
        <SectionTitle>Edit users</SectionTitle>
        <Form
          userData={{
            id: 1,
            name: "MD Aminul Islam",
            email: "MhX6V@example.com",
            phone: "01773840939"
          }}
        />
      </div>
    </Page>
  );
}
