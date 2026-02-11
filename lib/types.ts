export type LeadView = {
  id: string;
  businessName: string;
  ownerName?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  niche: string;
  subNiche: string;
  status: string;
};

export type TemplateView = {
  id: string;
  name: string;
  subject: string;
  body: string;
};
