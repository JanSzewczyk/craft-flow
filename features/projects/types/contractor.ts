export type ClientContractorAddress = {
  street: string;
  postalCode: string;
  city: string;
  country: string;
  additionalInfo: string | null;
};

export type ClientContractorListItem = {
  id: string;
  companyName: string;
  industry: string;
  email: string;
  phone: string | null;
  logoUrl: string | null;
  brandColor: string | null;
  projectCount: number;
  activeProjectCount: number;
  address: ClientContractorAddress | null;
};
