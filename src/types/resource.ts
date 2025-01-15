export interface Resource {
  id: string;
  Organization: string;
  ResourceDescription?: string;
  Address: string;
  City: string;
  State: string;
  Zip: string;
  County?: string;
  geocodedAddress?: string;
  latitude: number;
  longitude: number;
  ContactPerson?: string;
  ContactPersonPhone?: string;
  ContactPersonEmail?: string;
  GeneralConactPhone?: string;
  GeneralConactName_Department?: string;
  Website?: string;
  "Eligibility_(What_do_I_need_to_have_to_Qualify_for_benefit?)"?: string;
  "Apply_(How_do_I Apply_to_get_the_benefit?)"?: string;
  Notes?: string;
  CurrentStatus?: string;
  LastContactDate?: string;
}
