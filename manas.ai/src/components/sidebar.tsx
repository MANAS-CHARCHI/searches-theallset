import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import type { MenuItem } from "../types/types";
import {
  Mail,
  MessageSquare,
  BookOpen,
  Code,
  Search,
  Heart,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Search", path: "/search", icon: Search },
    { name: "Email Writer", path: "/email-writer", icon: Mail },
    {
      name: "Clean Message Writer",
      path: "/clean-message-writer",
      icon: MessageSquare,
    },
    { name: "Search Wikipedia", path: "/search-wikipedia", icon: BookOpen },
    { name: "Write Quick Code", path: "/write-quick-code", icon: Code },
  ];

  const contributionItem: MenuItem = {
    name: "Contribution",
    path: "/contribution",
    icon: Heart,
    muted: true,
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-2 left-4 z-50 p-2 rounded-md bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>
      {/* Overlay (click to close) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-25 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 shadow-sm z-40 pt-16 transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <nav className="flex flex-col px-4 py-10 space-y-2">
          {/* Main items */}
          <span className="text-xs font-medium text-gray-600">Tools</span>
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-left text-sm font-normal transition flex items-center gap-2 ${
                  isActive
                    ? "bg-gray-200 text-black"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {item.icon && <item.icon className="w-4 h-4 mr-2" />}
              {item.name}
            </NavLink>
          ))}

          {/* Divider */}
          <div className="border-t border-gray-200 my-3"></div>

          {/* Contribution (muted) */}
          <NavLink
            to={contributionItem.path}
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 rounded-lg text-left transition text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            {contributionItem.name}
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
