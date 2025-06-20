import React from "react";
import Select from "react-select";
import "flag-icons/css/flag-icons.min.css";

const countryOptions = [
  { code: "+91", iso: "in", name: "India" },
  { code: "+49", iso: "de", name: "Germany" },
  { code: "+1", iso: "us", name: "USA" },
  { code: "+31", iso: "nl", name: "Netherlands" },
];

// Format the data for react-select
const formattedOptions = countryOptions.map((country) => ({
  value: country.code,
  label: (
    <div className="flex items-center space-x-2">
      <span className={`fi fi-${country.iso}`}></span>
      <span>{country.name} ({country.code})</span>
    </div>
  ),
}));

// ✅ Define props for the component
interface CountryCodeSelectProps {
  onChange: (value: string) => void;
  selectedValue: string;
}

export default function CountryCodeSelect({
  onChange,
  selectedValue,
}: CountryCodeSelectProps) {
  return (
    <Select
      options={formattedOptions}
      onChange={(option: any) => onChange(option.value)}
      value={formattedOptions.find((opt) => opt.value === selectedValue)}
      isSearchable={false}
      className="w-full"
      classNamePrefix="react-select"
    />
  );
}
