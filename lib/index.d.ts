// Generated by dts-bundle v0.7.3

declare module 'studentvue' {
    import StudentVue from 'studentvue/StudentVue/StudentVue';
    export { default as ResourceType } from 'studentvue/Constants/ResourceType';
    export { default as EventType } from 'studentvue/Constants/EventType';
    export { default as RequestException } from 'studentvue/StudentVue/RequestException/RequestException';
    export { default as Message } from 'studentvue/StudentVue/Message/Message';
    export { default as Icon } from 'studentvue/StudentVue/Icon/Icon';
    export { default as Client } from 'studentvue/StudentVue/Client/Client';
    export { default as Attachment } from 'studentvue/StudentVue/Attachment/Attachment';
    export * from 'studentvue/StudentVue/ReportCard';
    export * from 'studentvue/StudentVue/Document';
    export * from 'studentvue/StudentVue/Client/Client.interfaces';
    export default StudentVue;
}

declare module 'studentvue/StudentVue/StudentVue' {
    import { SchoolDistrict, UserCredentials } from 'studentvue/StudentVue/StudentVue.interfaces';
    import Client from 'studentvue/StudentVue/Client/Client';
    import { StudentInfo } from 'studentvue/StudentVue/Client/Client.interfaces';
    export default class StudentVue {
        static login(districtUrl: string, credentials: UserCredentials): Promise<[Client, StudentInfo]>;
        static findDistricts(zipCode: string): Promise<SchoolDistrict[]>;
    }
}

declare module 'studentvue/Constants/ResourceType' {
    /**
      * The type the resource uses
      */
    enum ResourceType {
        FILE = "File",
        URL = "URL"
    }
    export default ResourceType;
}

declare module 'studentvue/Constants/EventType' {
    enum EventType {
        ASSIGNMENT = "Assignment",
        REGULAR = "Regular",
        HOLIDAY = "Holiday"
    }
    export default EventType;
}

declare module 'studentvue/StudentVue/RequestException/RequestException' {
    import { ParsedAnonymousRequestError, ParsedRequestError } from 'studentvue/utils/soap/Client/Client.interfaces';
    export default class RequestException {
        get message(): string;
        get stack(): string | undefined;
        constructor(obj: ParsedRequestError | {
            message: string;
            stack?: string;
        } | ParsedAnonymousRequestError);
    }
}

declare module 'studentvue/StudentVue/Message/Message' {
    import { LoginCredentials } from 'studentvue/utils/soap/Client/Client.interfaces';
    import soap from 'studentvue/utils/soap/soap';
    import Attachment from 'studentvue/StudentVue/Attachment/Attachment';
    import { MessageXMLObject } from 'studentvue/StudentVue/Message/Message.xml';
    import Icon from 'studentvue/StudentVue/Icon/Icon';
    export default class Message extends soap.Client {
            readonly icon: Icon;
            readonly id: string;
            readonly beginDate: string;
            readonly type: string;
            readonly htmlContent: string;
            readonly from: {
                    name: string;
                    staffGu: string;
                    email: string;
                    smMsgPersonGu: string;
            };
            readonly module: string;
            readonly subject: {
                    html: string;
                    raw: string;
            };
            readonly attachments: Attachment[];
            constructor(xmlObject: MessageXMLObject['PXPMessagesData'][0]['MessageListings'][0]['MessageListing'][0], credentials: LoginCredentials, hostUrl: string);
            /**
                * Check if a message has been read
                * @returns Returns a boolean declaring whether or not the message has been previously read
                */
            isRead(): boolean;
            /**
                * Check if a message is deletable
                * @returns Returns a boolean declaring whether or not the message is deletable
                */
            isDeletable(): boolean;
            /**
                * Marks the message as read
                * @returns Returns true to show that it has been marked as read
                * @example
                * ```js
                * const messages = await client.messages();
                * messages.every((msg) => msg.isRead()) // -> false
                * messages.forEach(async (msg) => !msg.isRead() && await msg.markAsRead());
                * messages.every((msg) => msg.isRead()) // -> true
                * const refetchedMessages = await client.messages(); // See if it updated on the server
                * messages.every((msg) => msg.isRead()) // -> true
                * ```
                * @example
                * ```tsx
                * // In a React project...
                * import React from 'react';
                *
                * const Message = (props) => {
                *  const { message } = props;
                *
                *  async function handleOnClick() {
                *    await message.markAsRead();
                *  }
                *
                *  return (
                *    <button onClick={handleOnClick} style={{ color: message.isRead() ? undefined : 'red' }}>
                *      <p>{message.subject.raw}</p>
                *    </button>
                *  )
                * }
                *
                * export default Message;
                * ```
                */
            markAsRead(): Promise<true>;
    }
}

declare module 'studentvue/StudentVue/Icon/Icon' {
    export default class Icon {
        readonly uri: string;
        constructor(path: string, hostUrl: string);
    }
}

declare module 'studentvue/StudentVue/Client/Client' {
    import { LoginCredentials } from 'studentvue/utils/soap/Client/Client.interfaces';
    import soap from 'studentvue/utils/soap/soap';
    import { SchoolInfo, StudentInfo } from 'studentvue/StudentVue/Client/Client.interfaces';
    import Message from 'studentvue/StudentVue/Message/Message';
    import { Calendar, CalendarOptions } from 'studentvue/StudentVue/Client/Interfaces/Calendar';
    import { Gradebook } from 'studentvue/StudentVue/Client/Interfaces/Gradebook';
    import { Attendance } from 'studentvue/StudentVue/Client/Interfaces/Attendance';
    import { Schedule } from 'studentvue/StudentVue/Client/Client.interfaces';
    import ReportCard from 'studentvue/StudentVue/ReportCard/ReportCard';
    import Document from 'studentvue/StudentVue/Document/Document';
    export default class Client extends soap.Client {
            constructor(credentials: LoginCredentials, hostUrl: string);
            /**
                * Gets the student's documents from synergy servers
                * @returns {Promise<Document[]}> Returns a list of student documents
                * @example
                * ```js
                * const documents = await client.documents();
                * const document = documents[0];
                * const files = await document.get();
                * const base64collection = files.map((file) => file.base64);
                * ```
                */
            documents(): Promise<Document[]>;
            /**
                * Gets a list of report cards
                * @returns {Promise<ReportCard[]>} Returns a list of report cards that can fetch a file
                * @example
                * ```js
                * const reportCards = await client.reportCards();
                * const files = await Promise.all(reportCards.map((card) => card.get()));
                * const base64arr = files.map((file) => file.base64); // ["JVBERi0...", "dUIoa1...", ...];
                * ```
                */
            reportCards(): Promise<ReportCard[]>;
            /**
                * Gets the student's school's information
                * @returns {Promise<SchoolInfo>} Returns the information of the student's school
                * @example
                * ```js
                * await client.schoolInfo();
                *
                * client.schoolInfo().then((schoolInfo) => {
                *  console.log(_.uniq(schoolInfo.staff.map((staff) => staff.name))); // List all staff positions using lodash
                * })
                * ```
                */
            schoolInfo(): Promise<SchoolInfo>;
            /**
                * Gets the schedule of the student
                * @param {number} termIndex The index of the term.
                * @returns {Promise<Schedule>} Returns the schedule of the student
                * @example
                * ```js
                * await schedule(0) // -> { term: { index: 0, name: '1st Qtr Progress' }, ... }
                * ```
                */
            schedule(termIndex?: number): Promise<Schedule>;
            /**
                * Returns the attendance of the student
                * @returns {Promise<Attendance>} Returns an Attendance object
                * @example
                * ```js
                * client.attendance()
                *  .then(console.log); // -> { type: 'Period', period: {...}, schoolName: 'University High School', absences: [...], periodInfos: [...] }
                * ```
                */
            attendance(): Promise<Attendance>;
            /**
                * Returns the gradebook of the student
                * @param {number} reportingPeriodIndex The timeframe that the gradebook should return
                * @returns {Promise<Gradebook>} Returns a Gradebook object
                * @example
                * ```js
                * const gradebook = await client.gradebook();
                * console.log(gradebook); // { error: '', type: 'Traditional', reportingPeriod: {...}, courses: [...] };
                *
                * await client.gradebook(0) // Some schools will have ReportingPeriodIndex 0 as "1st Quarter Progress"
                * await client.gradebook(7) // Some schools will have ReportingPeriodIndex 7 as "4th Quarter"
                * ```
                */
            gradebook(reportingPeriodIndex?: number): Promise<Gradebook>;
            /**
                * Get a list of messages of the student
                * @returns {Promise<Message[]>} Returns an array of messages of the student
                * @example
                * ```js
                * await client.messages(); // -> [{ id: 'E972F1BC-99A0-4CD0-8D15-B18968B43E08', type: 'StudentActivity', ... }, { id: '86FDA11D-42C7-4249-B003-94B15EB2C8D4', type: 'StudentActivity', ... }]
                * ```
                */
            messages(): Promise<Message[]>;
            /**
                * Gets the info of a student
                * @returns {Promise<StudentInfo>} StudentInfo object
                * @example
                * ```js
                * studentInfo().then(console.log) // -> { student: { name: 'Evan Davis', nickname: '', lastName: 'Davis' }, ...}
                * ```
                */
            studentInfo(): Promise<StudentInfo>;
            /**
                *
                * @param {CalendarOptions} options Options to provide for calendar method. An interval is required.
                * @returns {Promise<Calendar>} Returns a Calendar object
                * @example
                * ```js
                * client.calendar({ interval: { start: new Date('5/1/2022'), end: new Date('8/1/2021') }, concurrency: null }); // -> Limitless concurrency (not recommended)
                *
                * const calendar = await client.calendar({ interval: { ... }});
                * console.log(calendar); // -> { schoolDate: {...}, outputRange: {...}, events: [...] }
                * ```
                */
            calendar(options: CalendarOptions): Promise<Calendar>;
    }
}

declare module 'studentvue/StudentVue/Attachment/Attachment' {
    import { Base64String } from 'studentvue/utils/types';
    import { LoginCredentials } from 'studentvue/utils/soap/Client/Client.interfaces';
    import soap from 'studentvue/utils/soap/soap';
    export default class Attachment extends soap.Client {
        readonly name: string;
        readonly attachmentGu: string;
        readonly fileExtension: string | null;
        constructor(name: string, attachmentGu: string, session: LoginCredentials);
        /**
          * Fetches the attachment from synergy servers.
          * Unfortunately, the api does not offer a URL path to the file
          * @returns {string} base64 string
          *
          * @example
          * ```js
          * const base64 = await someAttachment.get();
          * console.log(base64) // -> UEsDBBQABgAIAAAAIQCj77s...
          * ```
          */
        get(): Promise<Base64String>;
    }
}

declare module 'studentvue/StudentVue/ReportCard' {
    export { default as ReportCard } from 'studentvue/StudentVue/ReportCard/ReportCard';
    export * from 'studentvue/StudentVue/ReportCard/ReportCard.interfaces';
}

declare module 'studentvue/StudentVue/Document' {
    export * from 'studentvue/StudentVue/Document/Document.interface';
    export { default as Document } from 'studentvue/StudentVue/Document/Document';
}

declare module 'studentvue/StudentVue/Client/Client.interfaces' {
    export * from 'studentvue/StudentVue/Client/Interfaces/StudentInfo';
    export * from 'studentvue/StudentVue/Client/Interfaces/Gradebook';
    export * from 'studentvue/StudentVue/Client/Interfaces/Calendar';
    export * from 'studentvue/StudentVue/Client/Interfaces/Attendance';
    export * from 'studentvue/StudentVue/Client/Interfaces/Schedule';
    export * from 'studentvue/StudentVue/Client/Interfaces/SchoolInfo';
    export * from 'studentvue/StudentVue/Client/Client';
    export interface Staff {
        name: string;
        email: string;
        staffGu: string;
    }
}

declare module 'studentvue/StudentVue/StudentVue.interfaces' {
    export interface SchoolDistrict {
        address: string;
        id: string;
        name: string;
        parentVueUrl: string;
    }
    
    export interface UserCredentials {
        username: string;
        password: string;
    }
}

declare module 'studentvue/utils/soap/Client/Client.interfaces' {
    export interface RequestOptions {
        skipLoginLog?: number;
        parent?: number;
        webServiceHandleName?: string;
        methodName: string;
        paramStr?: Record<string, unknown>;
    }
    
    export interface LoginCredentials {
        username: string;
        password: string;
        districtUrl: string;
    }
    
    export interface ParsedRequestResult {
        '?xml': string;
        'soap:Envelope': {
            'soap:Body': {
                ProcessWebServiceRequestResponse: {
                    ProcessWebServiceRequestResult: string;
                };
            };
        };
    }
    
    export interface ParsedRequestError {
        RT_ERROR: [
            {
                '@_ERROR_MESSAGE': [string];
                STACK_TRACE: [string];
            }
        ];
    }
    
    export interface ParsedAnonymousRequestError {
        RT_ERROR: {
            '@_ERROR_MESSAGE': string;
            STACK_TRACE: string;
        };
    }
}

declare module 'studentvue/utils/soap/soap' {
    import Client from 'studentvue/utils/soap/Client/Client';
    const _default: {
        Client: typeof Client;
    };
    export default _default;
}

declare module 'studentvue/StudentVue/Message/Message.xml' {
    export interface MessageXMLObject {
        PXPMessagesData: [
            {
                MessageListings: [
                    {
                        MessageListing: {
                            '@_IconURL': [string];
                            '@_ID': [string];
                            '@_BeginDate': [string];
                            '@_Type': [string];
                            '@_Subject': [string];
                            '@_Content': [string]; // This is a long html in a string
                            '@_Read': [string];
                            '@_Deletable': [string];
                            '@_From': [string];
                            '@_SubjectNoHTML': [string];
                            '@_Module': [string];
                            '@_Email': [string];
                            '@_StaffGU': [string];
                            '@_SMMsgPersonGU': [string];
                            AttachmentDatas:
                                | [
                                        {
                                            AttachmentData: {
                                                '@_AttachmentName': [string];
                                                '@_SmAttachmentGU': [string];
                                            }[];
                                        }
                                    ]
                                | string[];
                        }[];
                    }
                ];
            }
        ];
    }
}

declare module 'studentvue/StudentVue/Client/Interfaces/Calendar' {
    import EventType from 'studentvue/Constants/EventType';
    import Icon from 'studentvue/StudentVue/Icon/Icon';
    
    export interface CalendarOptions {
        interval: {
            start: Date | number;
            end: Date | number;
        };
        concurrency?: number | null;
    }
    
    export interface Calendar {
        schoolDate: {
            start: Date | number;
            end: Date | number;
        };
        outputRange: {
            start: Date | number;
            end: Date | number;
        };
        events: (AssignmentEvent | HolidayEvent | RegularEvent)[];
    }
    
    export interface Event {
        date: Date;
        title: string;
        type: EventType;
        startTime: string;
    }
    
    export interface AssignmentEvent extends Event {
        agu: string;
        link: string;
        dgu: string;
        viewType: string;
        addLinkData: string;
    }
    
    export interface HolidayEvent extends Event {}
    
    export interface RegularEvent extends Event {
        agu?: string;
        dgu?: string;
        link?: string;
        viewType?: string;
        addLinkData?: string;
        description?: string;
    }
}

declare module 'studentvue/StudentVue/Client/Interfaces/Gradebook' {
    import ResourceType from 'studentvue/Constants/ResourceType';
    import { Staff } from 'studentvue/StudentVue/Client/Client.interfaces';
    
    export interface Gradebook {
        error: string;
        type: string;
        reportingPeriod: {
            current: ReportingPeriod;
            available: ReportingPeriod[];
        };
        courses: Course[];
    }
    
    export interface ReportingPeriod {
        index: number;
        name: string;
        date: {
            start: Date;
            end: Date;
        };
    }
    
    export interface Course {
        period: number;
        title: string;
        room: string;
        staff: Staff;
        marks: Mark[];
    }
    
    export interface Mark {
        name: string;
        calculatedScore: {
            string: string;
            raw: number;
        };
        weightedCategories: WeightedCategory[];
        assignments: Assignment[];
    }
    
    export interface WeightedCategory {
        calculatedMark: string;
        type: string;
        weight: {
            evaluated: string;
            standard: string;
        };
        points: {
            current: number;
            possible: number;
        };
    }
    
    export interface Assignment {
        gradebookId: string;
        name: string;
        type: string;
        date: {
            start: Date;
            due: Date;
        };
        score: {
            type: string;
            value: string;
        };
        points: string;
        notes: string;
        teacherId: string;
        description: string;
        hasDropbox: boolean;
        studentId: string;
        dropboxDate: {
            start: Date;
            end: Date;
        };
        resources: (FileResource | URLResource)[];
    }
    
    export interface FileResource extends Resource {
        file: {
            type: string;
            name: string;
            uri: string;
        };
        resource: {
            date: Date;
            id: string;
            name: string;
        };
        type: ResourceType.FILE;
    }
    
    export interface URLResource extends Resource {
        url: string;
        type: ResourceType.URL;
        resource: {
            date: Date;
            id: string;
            name: string;
            description: string;
        };
        path: string;
    }
    
    export interface Resource {
        classId: string;
    
        gradebookId: string;
    
        sequence: string;
        teacherId: string;
    }
}

declare module 'studentvue/StudentVue/Client/Interfaces/Attendance' {
    import { Staff } from 'studentvue/StudentVue/Client/Client.interfaces';
    
    export interface Attendance {
        type: string;
        period: {
            total: number;
            start: number;
            end: number;
        };
        schoolName: string;
        absences: Absence[];
        periodInfos: PeriodInfo[];
    }
    
    export interface Absence {
        date: Date;
        reason: string;
        note: string;
        description: string;
        periods: AbsentPeriod[];
    }
    
    export interface AbsentPeriod {
        period: number;
        name: string;
        reason: string;
        course: string;
        staff: Staff;
        orgYearGu: string;
    }
    
    export interface PeriodInfo {
        period: number;
        total: {
            excused: number;
            tardies: number;
            unexcused: number;
            activities: number;
            unexcusedTardies: number;
        };
    }
}

declare module 'studentvue/StudentVue/ReportCard/ReportCard' {
    import { LoginCredentials } from 'studentvue/utils/soap/Client/Client.interfaces';
    import File from 'studentvue/StudentVue/File/File';
    import { ReportCardFile } from 'studentvue/StudentVue/ReportCard/ReportCard.interfaces';
    import { ReportCardBase64XMLObject, ReportCardsXMLObject } from 'studentvue/StudentVue/ReportCard/ReportCard.xml';
    export default class ReportCard extends File<ReportCardFile> {
        readonly date: Date;
        readonly periodName: string;
        protected parseXMLObject(xmlObject: ReportCardBase64XMLObject): ReportCardFile;
        constructor(xmlObj: ReportCardsXMLObject['RCReportingPeriodData'][0]['RCReportingPeriods'][0]['RCReportingPeriod'][0], credentials: LoginCredentials);
    }
}

declare module 'studentvue/StudentVue/Document/Document' {
    import { LoginCredentials } from 'studentvue/utils/soap/Client/Client.interfaces';
    import File from 'studentvue/StudentVue/File/File';
    import { DocumentFile } from 'studentvue/StudentVue/Document/Document.interface';
    import { DocumentFileXMLObject, DocumentXMLObject } from 'studentvue/StudentVue/Document/Document.xml';
    export default class Document extends File<DocumentFile[]> {
        readonly file: {
            name: string;
            date: Date;
            type: string;
        };
        readonly comment: string;
        protected parseXMLObject(xmlObject: DocumentFileXMLObject): {
            file: {
                name: string;
                type: string;
                date: Date;
            };
            category: string;
            notes: string;
            base64: string;
        }[];
        constructor(xmlObj: DocumentXMLObject['StudentDocuments'][0]['StudentDocumentDatas'][0]['StudentDocumentData'][0], credentials: LoginCredentials);
    }
}

declare module 'studentvue/utils/types' {
    export type Base64String = string;
}

declare module 'studentvue/StudentVue/ReportCard/ReportCard.interfaces' {
    export interface ReportCardFile {
        name: string;
        document: {
            type: string;
            name: string;
        };
        base64: string;
    }
}

declare module 'studentvue/StudentVue/Document/Document.interface' {
    export interface DocumentFile {
        file: {
            name: string;
            type: string;
            date: Date;
        };
        category: string;
        notes: string;
        base64: string;
    }
}

declare module 'studentvue/StudentVue/Client/Interfaces/StudentInfo' {
    import { Staff } from 'studentvue/StudentVue/Client/Client.interfaces';
    
    export interface StudentInfo {
        student: {
            name: string;
            nickname: string;
            lastName: string;
        };
        id: string;
        address: string;
        gender: string;
        grade: string;
        birthDate: string;
        email: string;
        phone: string;
        homeLanguage: string;
        currentSchool: string;
        track: string;
        homeRoomTeacher: {
            name: string;
            email: string;
            staffGu: string;
        };
        orgYearGu: string;
        homeRoom: string;
        counselor: Staff;
        photo: string;
        emergencyContacts: EmergencyContact[];
        physician: {
            name: string;
            phone: string;
            extn: string;
            hospital: string;
        };
        dentist: {
            name: string;
            phone: string;
            extn: string;
            office: string;
        };
        lockerInfoRecords: string;
        additionalInfo: AdditionalInfo[];
    }
    
    export interface AdditionalInfo {
        type: string;
        id: string;
        vcId: string;
        items: AdditionalInfoItem[];
    }
    
    export interface AdditionalInfoItem {
        type: string;
        source: {
            object: string;
            element: string;
        };
        vcId: string;
        value: string;
    }
    
    export interface EmergencyContact {
        name: string;
        relationship: string;
        phone: {
            home: string;
            work: string;
            other: string;
            mobile: string;
        };
    }
}

declare module 'studentvue/StudentVue/Client/Interfaces/Schedule' {
    import { Staff } from 'studentvue/StudentVue/Client/Client.interfaces';
    
    export interface Schedule {
        term: {
            index: number;
            name: string;
        };
        error: string;
        today: SchoolScheduleInfo[];
        classes: ClassInfo[];
        terms: TermInfo[];
    }
    
    export interface SchoolScheduleInfo {
        name: string;
        bellScheduleName: string;
        classes: ClassScheduleInfo[];
    }
    
    export interface TermInfo {
        index: number;
        name: string;
        date: {
            start: Date;
            end: Date;
        };
        schoolYearTermCodeGu: string;
    }
    
    export interface ClassInfo {
        period: number;
        name: string;
        room: string;
        teacher: Staff;
        sectionGu: string;
    }
    
    export interface ClassScheduleInfo {
        period: number;
        name: string;
        url: string;
        time: {
            start: Date;
            end: Date;
        };
        date: {
            start: Date;
            end: Date;
        };
        attendanceCode: string;
        sectionGu: string;
        teacher: Staff & { url: string; emailSubject: string };
    }
}

declare module 'studentvue/StudentVue/Client/Interfaces/SchoolInfo' {
    import { Staff } from 'studentvue/StudentVue/Client/Client.interfaces';
    export interface SchoolInfo {
        school: {
            address: string;
            addressAlt: string;
            city: string;
            zipCode: string;
            phone: string;
            altPhone: string;
            principal: Staff;
        };
        staff: StaffInfo[];
    }
    
    export interface StaffInfo extends Staff {
        jobTitle: string;
        extn: string;
        phone: string;
    }
}

declare module 'studentvue/utils/soap/Client/Client' {
    import { RequestOptions, LoginCredentials } from 'studentvue/utils/soap/Client/Client.interfaces';
    export default class Client {
        protected get credentials(): LoginCredentials;
        constructor(credentials: LoginCredentials);
        /**
          * Create a POST request to synergy servers to fetch data
          * @param options Options to provide when making a XML request to the servers
          * @returns Returns an XML object that must be defined in a type declaration file.
          * @link See https://github.com/StudentVue/docs
          * @example
          * ```js
          * super.processRequest({ methodName: 'Refer to StudentVue/docs', paramStr: { AnythingThatCanBePassed: true, AsLongAsItMatchesTheDocumentation: true }});
          * // This will make the XML request below:
          * ```
          *
          * ```xml
          * <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
              <ProcessWebServiceRequest xmlns="http://edupoint.com/webservices/">
                  <userID>STUDENT_USERNAME</userID>
                  <password>STUDENT_PASSWORD</password>
                  <skipLoginLog>1</skipLoginLog>
                  <parent>0</parent>
                  <webServiceHandleName>PXPWebServices</webServiceHandleName>
                  <methodName>Refer to StudentVue/docs</methodName>
                  <paramStr>
                    <AnythingThatCanBePassed>true</AnythingThatCanBePassed>
                    <AsLongAsItMatchesTheDocumentation>true</AsLongAsItMatchesTheDocumentation>
                  </paramStr>
              </ProcessWebServiceRequest>
            </soap:Body>
      </soap:Envelope>
          * ```
          */
        protected processRequest<T>(options: RequestOptions): Promise<T>;
        static processAnonymousRequest<T>(url: string, options?: Partial<RequestOptions>): Promise<T>;
    }
}

declare module 'studentvue/StudentVue/File/File' {
    import { LoginCredentials } from 'studentvue/utils/soap/Client/Client.interfaces';
    import soap from 'studentvue/utils/soap/soap';
    export default abstract class File<T> extends soap.Client {
            readonly documentGu: string;
            constructor(credentials: LoginCredentials, documentGu: string, methodName: string);
            /**
                * Parse the XML object to translate it into an ordinary object. This method must be written for every class that extends Document (which gets the file from synergy servers using a POST fetch request)
                * @param {unknown} xmlObject The XML Object passed after parsing
                * @protected
                * @returns {T} Returns a reformatted XML object to make it easier for code
                * @example
                * ```js
                * const xmlObject = await super.processRequest({...}); // { "@_Attribute": [{ "@_Nested": [{...}, {...}]}]}
                * parseXMLObject(xmlObject); // { attribute: { nested: [{...}, {...}] } }
                *
                * ```
                */
            protected abstract parseXMLObject(xmlObject: unknown): T;
            /**
                * Retrieve the file from synergy servers. After retrieving the xmlObject, this method calls parseXMLObject which must be defined to parse the xmlObject into a readable, typesafe object.
                * @public
                * @returns {Promise<T>} Returns a base64 object
                * @example
                * ```js
                * const base64 = await document.get(); // { attribute: { nested: {...} }, base64: "base64 code" }
                * ```
                */
            get(): Promise<T>;
    }
}

declare module 'studentvue/StudentVue/ReportCard/ReportCard.xml' {
    export interface ReportCardsXMLObject {
        RCReportingPeriodData: [
            {
                RCReportingPeriods: [
                    {
                        RCReportingPeriod: {
                            '@_ReportingPeriodGU': [string];
                            '@_ReportingPeriodName': [string];
                            '@_EndDate': [string];
                            '@_DocumentGU': [string];
                        }[];
                    }
                ];
            }
        ];
    }
    
    export interface ReportCardBase64XMLObject {
        DocumentData: [
            {
                '@_FileName': [string];
                '@_DocFileName': [string];
                '@_DocType': [string];
                Base64Code: [string];
            }
        ];
    }
}

declare module 'studentvue/StudentVue/Document/Document.xml' {
    export interface DocumentXMLObject {
        StudentDocuments: [
            {
                '@_showDateColumn': [string];
                '@_showDocNameColumn': [string];
                '@_StudentGU': [string];
                '@_StudentSSY': [string];
                StudentDocumentDatas: [
                    {
                        StudentDocumentData: {
                            '@_DocumentGU': [string];
                            '@_DocumentFileName': [string];
                            '@_DocumentDate': [string];
                            '@_DocumentType': [string];
                            '@_StudentGU': [string];
                            '@_DocumentComment': [string];
                        }[];
                    }
                ];
            }
        ];
    }
    
    export interface DocumentFileXMLObject {
        StudentAttachedDocumentData: [
            {
                DocumentCategoryLookups: [''];
                DocumentDatas: [
                    {
                        DocumentData: {
                            '@_DocumentGU': [string];
                            '@_StudentGU': [string];
                            '@_DocDate': [string];
                            '@_FileName': [string];
                            '@_Category': [string];
                            '@_Notes': [string];
                            '@_DocType': [string];
                            Base64Code: [string];
                        }[];
                    }
                ];
            }
        ];
    }
}

