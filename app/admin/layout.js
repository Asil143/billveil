export const metadata = { title: "BillVeil Admin" };

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#050810" }}>
        {children}
      </body>
    </html>
  );
}
