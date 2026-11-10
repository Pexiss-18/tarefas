"use client";

/**
 * Login e tarefas na nuvem (Firebase), no mesmo projeto do px_financeiro.
 *
 * Os valores de configuração NÃO são segredos: identificam o projeto e vão no
 * código de qualquer site com Firebase. Quem protege os dados são as regras do
 * Firestore (firestore.rules): cada pessoa só lê e escreve as próprias tarefas,
 * em tarefas/{uid}/tasks/{id}.
 */
import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  initializeFirestore,
  onSnapshot,
  persistentLocalCache,
  persistentMultipleTabManager,
  setDoc,
  updateDoc,
  type Firestore
} from "firebase/firestore";
import type { Task } from "./types";
import { isDateStr } from "./date";

const firebaseConfig = {
  apiKey: "AIzaSyCIFo_-cGKtgk3mRQsjvmAOVGwU5gU9eqw",
  authDomain: "px-financeiro.firebaseapp.com",
  projectId: "px-financeiro",
  storageBucket: "px-financeiro.firebasestorage.app",
  messagingSenderId: "2547362049",
  appId: "1:2547362049:web:578df48a8e755e4b47d300"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function init() {
  if (!app) {
    app = initializeApp(firebaseConfig, "tarefas");
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence).catch(() => {});
    // cache local: abre rápido e funciona sem internet; sincroniza quando volta
    try {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
      });
    } catch {
      db = initializeFirestore(app, {});
    }
  }
  return { auth: auth!, db: db! };
}

export function watchUser(cb: (user: User | null) => void) {
  return onAuthStateChanged(init().auth, cb);
}

export async function signIn(email: string, password: string, create: boolean) {
  const { auth } = init();
  if (create) await createUserWithEmailAndPassword(auth, email, password);
  else await signInWithEmailAndPassword(auth, email, password);
}

export function logOut() {
  return signOut(init().auth);
}

/** Mensagem curta, em português, para os erros de login mais comuns. */
export function authErrorMessage(e: unknown): string {
  const code = (e as { code?: string })?.code ?? "";
  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found")
    return "E-mail ou senha não batem.";
  if (code === "auth/email-already-in-use") return "Esse e-mail já tem conta. Use \"entrar\".";
  if (code === "auth/invalid-email") return "Esse e-mail não parece válido.";
  if (code === "auth/weak-password") return "A senha precisa de pelo menos 6 caracteres.";
  if (code === "auth/too-many-requests") return "Muitas tentativas. Espere um pouco e tente de novo.";
  if (code === "auth/network-request-failed") return "Sem conexão. Confira a internet e tente de novo.";
  return "Não deu pra entrar. Tente de novo.";
}

const tasksOf = (uid: string) => collection(init().db, "tarefas", uid, "tasks");

/** Assina as tarefas da pessoa: chama `cb` agora e a cada mudança (de qualquer aparelho). */
export function watchTasks(uid: string, cb: (tasks: Task[]) => void, onError: (e: unknown) => void) {
  return onSnapshot(
    tasksOf(uid),
    (snap) => {
      const tasks: Task[] = [];
      snap.forEach((d) => {
        const t = d.data() as Partial<Task>;
        if (typeof t.title === "string" && isDateStr(t.date))
          tasks.push({
            id: d.id,
            title: t.title,
            done: Boolean(t.done),
            date: t.date,
            createdAt: typeof t.createdAt === "string" ? t.createdAt : new Date(0).toISOString()
          });
      });
      tasks.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      cb(tasks);
    },
    onError
  );
}

/** Cria a tarefa já com id, para a tela mostrar na hora (o envio segue em segundo plano). */
export function newTask(uid: string, title: string, date: string): { task: Task; saved: Promise<void> } {
  const ref = doc(tasksOf(uid));
  const task: Task = { id: ref.id, title: title.trim().slice(0, 140), done: false, date, createdAt: new Date().toISOString() };
  const { id: _id, ...data } = task;
  return { task, saved: setDoc(ref, data) };
}

export function saveTask(uid: string, id: string, patch: Partial<Pick<Task, "title" | "done">>) {
  return updateDoc(doc(tasksOf(uid), id), patch);
}

export function restoreTask(uid: string, task: Task) {
  const { id, ...data } = task;
  return setDoc(doc(tasksOf(uid), id), data);
}

export function deleteTask(uid: string, id: string) {
  return deleteDoc(doc(tasksOf(uid), id));
}
