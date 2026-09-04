const navItems = [
  {
    id: "dashboard",
    icon: "⌂",
    label: "Home",
  },
  {
    id: "activity",
    icon: "◉",
    label: "Activity",
  },
  {
    id: "strength",
    icon: "⚡",
    label: "Strength",
  },
  {
    id: "recovery",
    icon: "☾",
    label: "Recovery",
  },
  {
    id: "nutrition",
    icon: "◈",
    label: "Nutrition",
  },
];

export default function BottomNavigation({
  activeTab,
  setActiveTab,
}) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "#121212",
        borderTop: "1px solid #292929",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "10px 4px 12px",
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: isActive ? "#39ff14" : "#777",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                padding: "6px 2px",
              }}
            >
              <span
                style={{
                  fontSize: "21px",
                  lineHeight: 1,
                  filter: isActive
                    ? "drop-shadow(0 0 6px #39ff14)"
                    : "none",
                }}
              >
                {item.icon}
              </span>

              <span
                style={{
                  fontSize: "9px",
                  fontWeight: isActive ? "800" : "500",
                  letterSpacing: "0.3px",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}