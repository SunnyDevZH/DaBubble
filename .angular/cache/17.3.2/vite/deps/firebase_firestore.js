import {
  AbstractUserDataWriter,
  AggregateField,
  AggregateQuerySnapshot,
  ByteString,
  Bytes,
  CollectionReference,
  DatabaseId,
  DocumentKey,
  DocumentReference,
  DocumentSnapshot,
  FieldPath,
  FieldPath$1,
  FieldValue,
  Firestore,
  FirestoreError,
  GeoPoint,
  LoadBundleTask,
  PersistentCacheIndexManager,
  Query,
  QueryCompositeFilterConstraint,
  QueryConstraint,
  QueryDocumentSnapshot,
  QueryEndAtConstraint,
  QueryFieldFilterConstraint,
  QueryLimitConstraint,
  QueryOrderByConstraint,
  QuerySnapshot,
  QueryStartAtConstraint,
  SnapshotMetadata,
  TestingHooks,
  Timestamp,
  Transaction,
  WriteBatch,
  __PRIVATE_AutoId,
  __PRIVATE_EmptyAppCheckTokenProvider,
  __PRIVATE_EmptyAuthCredentialsProvider,
  __PRIVATE_cast,
  __PRIVATE_debugAssert,
  __PRIVATE_isBase64Available,
  __PRIVATE_logWarn,
  __PRIVATE_validateIsNotUsedTogether,
  addDoc,
  aggregateFieldEqual,
  aggregateQuerySnapshotEqual,
  and,
  arrayRemove,
  arrayUnion,
  average,
  clearIndexedDbPersistence,
  collection,
  collectionGroup,
  connectFirestoreEmulator,
  count,
  deleteAllPersistentCacheIndexes,
  deleteDoc,
  deleteField,
  disableNetwork,
  disablePersistentCacheIndexAutoCreation,
  doc,
  documentId,
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence,
  enableNetwork,
  enablePersistentCacheIndexAutoCreation,
  endAt,
  endBefore,
  ensureFirestoreConfigured,
  executeWrite,
  getAggregateFromServer,
  getCountFromServer,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  getFirestore,
  getPersistentCacheIndexManager,
  increment,
  initializeFirestore,
  limit,
  limitToLast,
  loadBundle,
  memoryEagerGarbageCollector,
  memoryLocalCache,
  memoryLruGarbageCollector,
  namedQuery,
  onSnapshot,
  onSnapshotsInSync,
  or,
  orderBy,
  pe,
  persistentLocalCache,
  persistentMultipleTabManager,
  persistentSingleTabManager,
  query,
  queryEqual,
  refEqual,
  runTransaction,
  serverTimestamp,
  setDoc,
  setIndexConfiguration,
  setLogLevel,
  snapshotEqual,
  startAfter,
  startAt,
  sum,
  terminate,
  updateDoc,
  waitForPendingWrites,
  where,
  writeBatch
} from "./chunk-EDKNM7CZ.js";
import "./chunk-GIWOEVAA.js";
import "./chunk-LJ4VCL4A.js";
export {
  AbstractUserDataWriter,
  AggregateField,
  AggregateQuerySnapshot,
  Bytes,
  pe as CACHE_SIZE_UNLIMITED,
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  FieldPath,
  FieldValue,
  Firestore,
  FirestoreError,
  GeoPoint,
  LoadBundleTask,
  PersistentCacheIndexManager,
  Query,
  QueryCompositeFilterConstraint,
  QueryConstraint,
  QueryDocumentSnapshot,
  QueryEndAtConstraint,
  QueryFieldFilterConstraint,
  QueryLimitConstraint,
  QueryOrderByConstraint,
  QuerySnapshot,
  QueryStartAtConstraint,
  SnapshotMetadata,
  Timestamp,
  Transaction,
  WriteBatch,
  __PRIVATE_AutoId as _AutoId,
  ByteString as _ByteString,
  DatabaseId as _DatabaseId,
  DocumentKey as _DocumentKey,
  __PRIVATE_EmptyAppCheckTokenProvider as _EmptyAppCheckTokenProvider,
  __PRIVATE_EmptyAuthCredentialsProvider as _EmptyAuthCredentialsProvider,
  FieldPath$1 as _FieldPath,
  TestingHooks as _TestingHooks,
  __PRIVATE_cast as _cast,
  __PRIVATE_debugAssert as _debugAssert,
  __PRIVATE_isBase64Available as _isBase64Available,
  __PRIVATE_logWarn as _logWarn,
  __PRIVATE_validateIsNotUsedTogether as _validateIsNotUsedTogether,
  addDoc,
  aggregateFieldEqual,
  aggregateQuerySnapshotEqual,
  and,
  arrayRemove,
  arrayUnion,
  average,
  clearIndexedDbPersistence,
  collection,
  collectionGroup,
  connectFirestoreEmulator,
  count,
  deleteAllPersistentCacheIndexes,
  deleteDoc,
  deleteField,
  disableNetwork,
  disablePersistentCacheIndexAutoCreation,
  doc,
  documentId,
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence,
  enableNetwork,
  enablePersistentCacheIndexAutoCreation,
  endAt,
  endBefore,
  ensureFirestoreConfigured,
  executeWrite,
  getAggregateFromServer,
  getCountFromServer,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  getFirestore,
  getPersistentCacheIndexManager,
  increment,
  initializeFirestore,
  limit,
  limitToLast,
  loadBundle,
  memoryEagerGarbageCollector,
  memoryLocalCache,
  memoryLruGarbageCollector,
  namedQuery,
  onSnapshot,
  onSnapshotsInSync,
  or,
  orderBy,
  persistentLocalCache,
  persistentMultipleTabManager,
  persistentSingleTabManager,
  query,
  queryEqual,
  refEqual,
  runTransaction,
  serverTimestamp,
  setDoc,
  setIndexConfiguration,
  setLogLevel,
  snapshotEqual,
  startAfter,
  startAt,
  sum,
  terminate,
  updateDoc,
  waitForPendingWrites,
  where,
  writeBatch
};
//# sourceMappingURL=firebase_firestore.js.map
