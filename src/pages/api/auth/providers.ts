export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(403).json({ error: "Access to providers is restricted." });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}