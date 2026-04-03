import React from "react";
import Button from "@/src/components/ui/Button";
import { SectionLayout, SubTitle } from "../components/SectionLayout";
import { HiSearch, HiCog } from "react-icons/hi";

export const ButtonSection = () => (
  <SectionLayout id="buttons" title="Buttons">
    <SubTitle>Variants</SubTitle>
    <div className="flex flex-wrap items-center gap-6">
      <Button variant="primary">Primary Action</Button>
      <Button variant="secondary">Secondary Action</Button>
      <Button variant="outline">Outline Style</Button>
      <Button variant="ghost">Ghost Button</Button>
      <Button variant="danger">Danger Action</Button>
    </div>

    <SubTitle>Sizes</SubTitle>
    <div className="flex flex-wrap items-center gap-6">
      <Button size="sm">Small Action</Button>
      <Button size="md">Medium Action</Button>
      <Button size="lg">Large Premium Action</Button>
    </div>

    <SubTitle>States & Icons</SubTitle>
    <div className="flex flex-wrap items-center gap-6">
      <Button loading>Loading State</Button>
      <Button disabled>Disabled Button</Button>
      <Button icon={<HiSearch />}>Search Icon</Button>
      <Button variant="outline" icon={<HiCog className="animate-spin-slow" />}>
         Settings Gear
      </Button>
    </div>
  </SectionLayout>
);
