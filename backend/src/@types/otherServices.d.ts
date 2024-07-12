import { SiteData, DeepPartial, BackupIndex } from "living-mile-high-lib";
import { ContentCategory, ContentType } from "./constants";
import { GeneralData } from "./database";
import {
    CopyObjectCommandOutput, GetObjectCommandOutput, PutObjectAclCommandOutput,
} from "@aws-sdk/client-s3";
import {
    CdnAdapter,
    ImageService,
    BackupService,
} from "./cdnServices";
import {
    HouseService,
    AdminService,
    GeneralDataService,
    StateService
} from "./dbServices";

export interface ServiceManager<T> {
    public connect(): Promise<T>;
    public disconnect(): Promise<void>;
}

export type ServiceDict = {
    houseService: HouseService;
    adminService: AdminService;
    imageService: ImageService;
    cdnAdapter: CdnAdapter;
    generalDataService: GeneralDataService;
    stateService: StateService;
    backupService: BackupService;
};

export type SiteServiceManager = ServiceManager<ServiceDict>;

