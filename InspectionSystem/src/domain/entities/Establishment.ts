export interface Establishment {
    id: string;
    participantId?: number;
    participantNumber?: string;
    nameAr: string;
    nameEn: string;
    establishmentTypeAr: string;
    typeId: string;
    mobile: string;
    phone: string;
    email: string;
    tradeLicenseNumber: string;
    emirateAr: string;
    emirateEn: string;
    area: string;
    latitude?: number;
    longitude?: number;
}
