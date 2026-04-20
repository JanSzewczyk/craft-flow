"use client";

import * as React from "react";

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@szum-tech/design-system";
import { EMAIL_TEMPLATE_TABS } from "~/features/contractor/constants/email-template-tabs";
import { EMAIL_VARIABLES } from "~/features/contractor/constants/email-variables";
import { type EmailFormData } from "~/features/contractor/schemas/email-schema";
import { type EmailTemplate } from "~/features/contractor/server";
import { type ActionResponse } from "~/lib/action-types";

import { EmailTemplateForm } from "./form/email-template-form";

type EmailNotificationsEditorProps = {
  defaultValues?: { emailSubject: string; emailBody: string } | null;
  onSaveAction(data: EmailFormData): ActionResponse<EmailTemplate>;
};

export function EmailNotificationsEditor({ defaultValues, onSaveAction }: EmailNotificationsEditorProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <Tabs defaultValue="WELCOME">
        <TabsList>
          {EMAIL_TEMPLATE_TABS.map((tab) => (
            <TabsTrigger key={tab.type} value={tab.type} disabled={!tab.enabled}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="WELCOME" className="mt-6">
          <EmailTemplateForm defaultValues={defaultValues} onSaveAction={onSaveAction} />
        </TabsContent>
      </Tabs>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-body-sm">Dostępne zmienne</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {EMAIL_VARIABLES.map((v) => (
              <div key={v.placeholder} className="flex flex-col gap-0.5">
                <Badge variant="outline" className="font-code w-fit">
                  {v.placeholder}
                </Badge>
                <span className="text-body-xs text-muted-foreground">{v.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
