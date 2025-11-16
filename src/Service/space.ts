import { db } from "../config/firebase";
import { doc, setDoc, getDoc, collection, onSnapshot, addDoc, orderBy, query, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore";
import type { Post, Reply, Space } from "../types/int";

export const createSpace = async (spaceId: string) => {
  const expires = Date.now() + 24 * 60 * 60 * 1000;
  await setDoc(doc(db, "spaces", spaceId), {
    createdAt: serverTimestamp(),
    expiresAt: expires,
    isHost: true,
  });
};

export const joinSpace = async (spaceId: string) => {
  const ref = doc(db, "spaces", spaceId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Space not found");
  const data = snap.data();
  if (data.expiresAt < Date.now()) throw new Error("Space expired");
  return snap.id;
};

export const listenSpaces = (callback: (spaces: Space[]) => void) => {
  return onSnapshot(collection(db, "spaces"), snapshot => {
    const loaded: Space[] = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        posts: [],
        createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
        expiresAt: data.expiresAt ?? Date.now() + 86400000,
        isHost: data.isHost ?? false,
        lastMessage: data.lastMessage ?? "",
        messageCount: data.messageCount ?? 0,
      };
    });
    callback(loaded);
  });
};

export const listenPosts = (spaceId: string, callback: (posts: Post[]) => void) => {
  const q = query(collection(db, "spaces", spaceId, "posts"), orderBy("timestamp", "desc"));
  return onSnapshot(q, snapshot => {
    const loadedPosts: Post[] = snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        content: data.content ?? "",
        timestamp: data.timestamp?.toMillis?.() ?? Date.now(),
        likes: data.likedBy?.length ?? 0,
        liked: data.likedBy?.includes("anon") ?? false,
        replies: data.replies ?? [],
      };
    });
    callback(loadedPosts);
  });
};

export const addPost = async (spaceId: string, content: string) => {
  await addDoc(collection(db, "spaces", spaceId, "posts"), {
    content,
    timestamp: serverTimestamp(),
    likedBy: [],
    replies: [],
  });
};

export const likePost = async (spaceId: string, postId: string, liked: boolean) => {
  const postRef = doc(db, "spaces", spaceId, "posts", postId);
  if (liked) await updateDoc(postRef, { likedBy: arrayRemove("anon") });
  else await updateDoc(postRef, { likedBy: arrayUnion("anon") });
};

export const addReply = async (spaceId: string, postId: string, content: string) => {
  const postRef = doc(db, "spaces", spaceId, "posts", postId);
  const reply: Reply = { id: Math.random().toString(36).substring(2, 8), content, timestamp: Date.now() };
  await updateDoc(postRef, { replies: arrayUnion(reply) });
};
