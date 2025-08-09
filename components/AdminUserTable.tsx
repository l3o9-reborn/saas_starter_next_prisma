'use client'
import React, { useEffect, useState, useRef } from "react"
import { v4 as uuidv4 } from "uuid"

function toLocalDateTimeInputValue(dateString: string): string {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

type Role = "USER" | "ADMIN"
type ActionType = "CREATE" | "UPDATE" | "DELETE" | null;

type User = {
  id: string
  name: string
  email: string
  emailVerified: string | null
  image: string
  password: string
  role: Role
  subscriptionPlanId: string
  actionType?: ActionType
}

const allColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "emailVerified", label: "Email Verified" },
  { key: "image", label: "Image" },
  { key: "password", label: "Password" },
  { key: "role", label: "Role" },
  { key: "subscriptionPlanId", label: "Subscription Plan" },
  { key: "actions", label: "Actions" },
];



const UserTable = () => {
  const [users, setUsers] = useState<User[]>([])
  const originalUsersRef = useRef<Map<string, User>>(new Map());
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns.map(c => c.key));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("")

// Fetch users from backend
  useEffect(() => {
   const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/dashboard/users`);
        const data: User[] = await res.json();
        setUsers(data);
        originalUsersRef.current = new Map(data.map((u) => [u.id, u]));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers()
  }, [])

  // Add new user
  const handleAdd = () => {
   const newUser: User = {
    id: uuidv4(),
    name: "",
    email: "",
    emailVerified: null,
    image: "",
    password: "",
    role: "USER",
    subscriptionPlanId: "",
    actionType: "CREATE",
  };

  setUsers((prev) => [...prev, newUser]);
  originalUsersRef.current.set(newUser.id, newUser);
  }

  // Save created or updated user
const handleSave = async (user: User) => {
    if (!user.email) {
    alert('Email is required.');
    return;
  }
  if (user.actionType === "CREATE") {
    // POST to create
    const res = await fetch('/api/dashboard/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
    const created = await res.json();

    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...created, actionType: null } : u))
    );

    originalUsersRef.current.delete(user.id); // delete temp
    originalUsersRef.current.set(created.id, created); // new DB user
  } else if (user.actionType === "UPDATE") {
    // PUT to update
    const res = await fetch(`/api/dashboard/users/${user.email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),

    });
    const updated = await res.json();

    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...updated, actionType: null } : u))
    );

    originalUsersRef.current.set(user.id, { ...user, actionType: null });
  }
};


const handleCancel = (user: User) => {
  const original = originalUsersRef.current.get(user.id);
  if (!original) return;


  if (user.actionType === "CREATE") {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    originalUsersRef.current.delete(user.id); // Remove temp entry
  } else if (user.actionType === "UPDATE") {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...original, actionType: null } : u
      )
    );
  }
};


  // Delete user
  const handleDelete = async (user: User) => {
    if (user.actionType === 'CREATE') {
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
      return
    }

    await fetch(`/api/dashboard/users/${user.email}`, { method: 'DELETE' });

    setUsers((prev) => prev.filter((u) => u.id !== user.id))
  }

  // Track user edits
  const handleInputChange = (id: string, field: keyof User, value: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              [field]: value,
              actionType: !user.actionType ? 'UPDATE' : user.actionType,
            }
          : user
      )
    )
  }

  const filteredUsers = users
    .filter((user) => user.email?.toLowerCase().includes(search.toLowerCase()))
 
  return (
    <div className=" md:p-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 mb-4">
        <input
          type="text"
          placeholder="Search by email"
          className="border-2 border-pink-800 rounded-md p-2 max-w-[250px] md:min-w-[400px] outline-none text-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex items-center gap-2 ">
        <div className="relative inline-block ">
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="inline-flex text-sm md:text-md items-center px-3 py-2  rounded bg-pink-800 text-gray-300 "
              >
                Show Columns
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-pink-800 shadow-lg rounded-md overflow-hidden z-10">
                  {allColumns.map(col => (
                    <label key={col.key} className="flex items-center px-4 py-2 hover:bg-gray-100 hover:text-pink-800">
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.key)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setVisibleColumns(prev =>
                            checked
                              ? [...prev, col.key]
                              : prev.filter(k => k !== col.key)
                          );
                        }}
                        className="mr-2"
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

          <button
            onClick={handleAdd}
            className="bg-green-500 text-sm md:text-md  text-white px-3 py-2  border-green-500  rounded-md text-sm cursor-pointer hover:bg-white hover:text-green-500 transition-colors duration-300"
          >
            Add User
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-xs">
        <thead className="bg-pink-800 text-left">
        <tr>
            {allColumns.map(
            (col) =>
                visibleColumns.includes(col.key) && (
                <th key={col.key} className="border px-2 py-1">
                    {col.label}
                </th>
                )
            )}
        </tr>
        </thead>
       <tbody>
            {filteredUsers.map((user) => (
                <tr key={user.id} className="h-10">
                {visibleColumns.includes("id") && (
                    <td className="border px-2 py-1 truncate max-w-[120px]">{user.id}</td>
                )}
                {visibleColumns.includes("name") && (
                    <td className="border">
                    <input
                        className="w-full h-10 px-1 outline-pink-800"
                        value={user.name}
                        onChange={(e) => handleInputChange(user.id, "name", e.target.value)}
                    />
                    </td>
                )}
                {visibleColumns.includes("email") && (
                    <td className="border">
                    <input
                        className="w-full h-10 px-1 outline-pink-800"
                        value={user.email}
                        onChange={(e) => handleInputChange(user.id, "email", e.target.value)}
                    />
                    </td>
                )}
                {visibleColumns.includes("emailVerified") && (
                    <td className="border">
                    {user.emailVerified ? (
                        <input
                        type="datetime-local"
                        className="w-full h-10 px-1 text-green-500 outline-pink-800"
                        value={toLocalDateTimeInputValue(user.emailVerified)}
                        onChange={(e) =>
                            handleInputChange(user.id, "emailVerified", e.target.value)
                        }
                        />
                    ) : (
                        <button
                        onClick={() =>
                            handleInputChange(user.id, "emailVerified", new Date().toISOString())
                        }
                        className="text-xs bg-green-800 hover:bg-green-600 cursor-pointer border w-full h-10"
                        >
                        Verify Now
                        </button>
                    )}
                    </td>
                )}
                {visibleColumns.includes("image") && (
                    <td className="border">
                    <input
                        className="w-full h-10 px-1 outline-pink-800"
                        value={user.image}
                        onChange={(e) => handleInputChange(user.id, "image", e.target.value)}
                    />
                    </td>
                )}
                {visibleColumns.includes("password") && (
                    <td className="border">
                    <input
                        className="w-full h-10 px-1 outline-pink-800"
                        value={user.password}
                        onChange={(e) => handleInputChange(user.id, "password", e.target.value)}
                    />
                    </td>
                )}
                {visibleColumns.includes("role") && (
                    <td className="border">
                    <select
                        className="w-full h-10 min-w-15 outline-pink-800 text-xs"
                        value={user.role}
                        onChange={(e) => handleInputChange(user.id, "role", e.target.value)}
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    </td>
                )}
                {visibleColumns.includes("subscriptionPlanId") && (
                    <td className="border">
                    <input
                        placeholder="null"
                        className="w-full h-10 px-1 outline-pink-800"
                        value={user.subscriptionPlanId}
                        onChange={(e) => handleInputChange(user.id, "subscriptionPlanId", e.target.value)}
                    />
                    </td>
                )}
                <td className="border  w-full h-10 px-1 flex items-center justify-around ">
                    {user.actionType === "CREATE" ? (
                      <>
                        <button
                          className="text-green-400 text-xs cursor-pointer underline"
                          onClick={() => handleSave(user)}
                        >
                          Create
                        </button>
                        <button
                          className="text-gray-400 text-xs cursor-pointer underline"
                          onClick={() => handleCancel(user)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : user.actionType === "UPDATE" ? (
                      <>
                        <button
                          className="text-blue-400 text-xs cursor-pointer underline"
                          onClick={() => handleSave(user)}
                        >
                          Save
                        </button>
                        <button
                          className="text-gray-400 text-xs cursor-pointer underline"
                          onClick={() => handleCancel(user)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="text-red-400 px-5 text-xs cursor-pointer underline"
                        onClick={() => handleDelete(user)}
                      >
                        Delete
                      </button>
                    )}
                  </td>



                </tr>
            ))}
            </tbody>

        </table>
      </div>
    </div>
  )
}

export default UserTable
