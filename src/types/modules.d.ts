// Firebase types
declare module 'firebase/app' {
  import { FirebaseApp, FirebaseOptions, FirebaseError } from 'firebase/app';
  
  export function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
  export function getApp(name?: string): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export function deleteApp(app: FirebaseApp): Promise<void>;
  export const SDK_VERSION: string;
  export const apps: FirebaseApp[];
  
  export { FirebaseApp, FirebaseOptions, FirebaseError };
  
  // Add other Firebase app types as needed
}

declare module 'firebase/auth' {
  import { 
    User, 
    UserCredential, 
    Auth, 
    AuthProvider, 
    UserInfo,
    AuthError,
    AuthErrorCodes,
    IdTokenResult,
    ActionCodeSettings,
    ApplicationVerifier,
    ConfirmationResult,
    MultiFactorUser,
    MultiFactorError,
    OAuthCredential,
    OAuthProvider,
    PhoneAuthProvider,
    RecaptchaVerifier,
    UserCredential as FirebaseUserCredential,
    UserMetadata,
    NextOrObserver,
    Unsubscribe,
    ActionCodeInfo
  } from 'firebase/auth';
  
  export function getAuth(app?: FirebaseApp): Auth;
  export function signInWithPopup(auth: Auth, provider: AuthProvider): Promise<UserCredential>;
  export function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
  export function createUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
  export function signOut(auth: Auth): Promise<void>;
  export function onAuthStateChanged(
    auth: Auth,
    nextOrObserver: NextOrObserver<User | null>,
    error?: (error: AuthError) => void,
    completed?: Unsubscribe
  ): Unsubscribe;
  export function sendPasswordResetEmail(auth: Auth, email: string, actionCodeSettings?: ActionCodeSettings): Promise<void>;
  export function confirmPasswordReset(auth: Auth, oobCode: string, newPassword: string): Promise<void>;
  export function verifyPasswordResetCode(auth: Auth, code: string): Promise<string>;
  export function applyActionCode(auth: Auth, oobCode: string): Promise<void>;
  
  // Re-export types
  export {
    User,
    UserCredential,
    Auth,
    AuthProvider,
    UserInfo,
    AuthError,
    AuthErrorCodes,
    IdTokenResult,
    ActionCodeSettings,
    ApplicationVerifier,
    ConfirmationResult,
    MultiFactorUser,
    MultiFactorError,
    OAuthCredential,
    OAuthProvider,
    PhoneAuthProvider,
    RecaptchaVerifier,
    FirebaseUserCredential,
    UserMetadata,
    NextOrObserver,
    Unsubscribe,
    ActionCodeInfo
  };
}

declare module 'firebase/firestore' {
  import { 
    Firestore, 
    DocumentData, 
    DocumentReference, 
    QueryDocumentSnapshot,
    DocumentSnapshot,
    CollectionReference,
    Query,
    QuerySnapshot,
    QueryConstraint,
    WhereFilterOp,
    OrderByDirection,
    DocumentChange,
    DocumentChangeType,
    FieldValue,
    FieldPath,
    Timestamp,
    Transaction,
    WriteBatch,
    SetOptions,
    UpdateData,
    WithFieldValue,
    PartialWithFieldValue,
    QueryNonFilterCondition,
    QueryOrderByConstraint,
    QueryStartAtConstraint,
    QueryEndAtConstraint,
    QueryLimitConstraint,
    QueryFieldFilterConstraint,
    QueryCompositeFilterConstraint
  } from 'firebase/firestore';
  
  export function getFirestore(app?: FirebaseApp): Firestore;
  export function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference<DocumentData>;
  export function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference<DocumentData>;
  export function getDoc<T = DocumentData>(docRef: DocumentReference<T>): Promise<DocumentSnapshot<T>>;
  export function getDocs<T = DocumentData>(query: Query<T>): Promise<QuerySnapshot<T>>;
  export function setDoc<T>(reference: DocumentReference<T>, data: WithFieldValue<T>): Promise<void>;
  export function updateDoc<T>(reference: DocumentReference<T>, data: UpdateData<T>): Promise<void>;
  export function deleteDoc(reference: DocumentReference): Promise<void>;
  export function addDoc<T>(reference: CollectionReference<T>, data: WithFieldValue<T>): Promise<DocumentReference<T>>;
  export function query<T>(query: Query<T>, ...queryConstraints: QueryConstraint[]): Query<T>;
  export function where(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: any): QueryFieldFilterConstraint;
  export function orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection): QueryOrderByConstraint;
  export function limit(limit: number): QueryLimitConstraint;
  export function startAt(...fieldValues: any[]): QueryStartAtConstraint;
  export function startAfter(...fieldValues: any[]): QueryStartAtConstraint;
  export function endBefore(...fieldValues: any[]): QueryEndAtConstraint;
  export function endAt(...fieldValues: any[]): QueryEndAtConstraint;
  export function runTransaction<T>(firestore: Firestore, updateFunction: (transaction: Transaction) => Promise<T>): Promise<T>;
  export function writeBatch(firestore: Firestore): WriteBatch;
  
  // Re-export types
  export {
    DocumentData,
    DocumentReference,
    QueryDocumentSnapshot,
    DocumentSnapshot,
    CollectionReference,
    Query,
    QuerySnapshot,
    QueryConstraint,
    WhereFilterOp,
    OrderByDirection,
    DocumentChange,
    DocumentChangeType,
    FieldValue,
    FieldPath,
    Timestamp,
    Transaction,
    WriteBatch,
    SetOptions,
    UpdateData,
    WithFieldValue,
    PartialWithFieldValue,
    QueryNonFilterCondition,
    QueryOrderByConstraint,
    QueryStartAtConstraint,
    QueryEndAtConstraint,
    QueryLimitConstraint,
    QueryFieldFilterConstraint,
    QueryCompositeFilterConstraint
  };
}

// Chart.js and react-chartjs-2
declare module 'react-chartjs-2' {
  import { ComponentType, CSSProperties } from 'react';
  import { 
    ChartOptions, 
    ChartData, 
    ChartType, 
    ChartDataset,
    ChartTypeRegistry,
    Plugin,
    UpdateMode,
    Chart as ChartJS,
    ChartConfiguration,
    ChartComponent,
    ChartType as ChartJSType,
    DefaultDataPoint,
    InteractionMode,
    TooltipModel,
    TooltipItem,
    ChartEvent,
    ActiveElement,
    ScriptableContext,
    ChartArea,
    ChartMeta,
    ScaleOptionsByType,
    Scale
  } from 'chart.js';
  
  export interface ChartProps<TType extends keyof ChartTypeRegistry = keyof ChartTypeRegistry, TData = DefaultDataPoint<TType>, TLabel = unknown> {
    type: TType;
    data: ChartData<TType, TData, TLabel>;
    options?: ChartOptions<TType>;
    width?: number | string;
    height?: number | string;
    datasetIdKey?: string;
    getElementAtEvent?: (elements: ActiveElement[], event: ChartEvent) => void;
    getElementsAtEvent?: (elements: ActiveElement[], event: ChartEvent) => void;
    getDatasetAtEvent?: (elements: ActiveElement[], event: ChartEvent) => void;
  }
  
  export const Line: ComponentType<ChartProps>;
  export const Bar: ComponentType<ChartProps>;
  export const Pie: ComponentType<ChartProps>;
  export const Doughnut: ComponentType<ChartProps>;
  export const Radar: ComponentType<ChartProps>;
  export const Polar: ComponentType<ChartProps>;
  export const Bubble: ComponentType<ChartProps>;
  export const Scatter: ComponentType<ChartProps>;
  
  // Re-export chart.js types
  export * from 'chart.js';
}

declare module 'react-window' {
  import { CSSProperties, ReactElement, ComponentType } from 'react';
  
  export interface ListChildComponentProps {
    index: number;
    style: CSSProperties;
  }
  
  export interface ListProps {
    children: ComponentType<ListChildComponentProps>;
    className?: string;
    direction?: 'ltr' | 'rtl';
    height: number | string;
    initialScrollOffset?: number;
    innerRef?: any;
    innerElementType?: string | any;
    innerTagName?: string;
    itemCount: number;
    itemData?: any;
    itemKey?: (index: number, data: any) => any;
    itemSize: number;
    layout?: 'horizontal' | 'vertical';
    onItemsRendered?: (props: ListOnItemsRenderedProps) => any;
    onScroll?: (props: ListOnScrollProps) => any;
    outerRef?: any;
    outerElementType?: string | any;
    outerTagName?: string;
    overscanCount?: number;
    style?: CSSProperties;
    useIsScrolling?: boolean;
    width: number | string;
  }
  
  export const FixedSizeList: ComponentType<ListProps>;
  
  // Add other react-window components and types as needed
}

// Add other third-party module declarations as needed
