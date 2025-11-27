export function generateChatId(id1, id2) {
  if (!id1 || !id2) throw new Error("Both users IDs required for chatId");

  return [id1.toString(), id2.toString()].sort().join("_");
}
