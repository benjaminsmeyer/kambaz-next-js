/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import PeopleDetails from "../../people/details";
import * as usersClient from "../../../../users/client";
import * as enrollmentsClient from "../../../../enrollments/client";
export default function PeopleTable({
  users,
  fetchUsers,
}: {
  users?: any[];
  fetchUsers?: () => void;
}) {
  const { cid } = useParams();
  const [routeUsers, setRouteUsers] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showUserId, setShowUserId] = useState<string | null>(null);

  const getEnrolledUsers = useCallback(async () => {
    try {
      const [enrollments, allUsers] = await Promise.all([
        enrollmentsClient.findEnrollmentsForCourse(String(cid)),
        usersClient.findAllUsers(),
      ]);
      const enrolledUserIds = new Set(
        (enrollments || []).map((enrollment: any) => enrollment.user),
      );
      return (allUsers || []).filter((user: any) =>
        enrolledUserIds.has(user._id),
      );
    } catch (err) {
      console.error("Failed to load enrolled users", err);
      return [];
    }
  }, [cid]);

  useEffect(() => {
    // If users are supplied by a parent (e.g. account/users), render those.
    if (users !== undefined) {
      return;
    }
    const loadUsers = async () => {
      const enrolledUsers = await getEnrolledUsers();
      setRouteUsers(enrolledUsers);
    };
    loadUsers();
  }, [users, getEnrolledUsers]);

  const tableUsers = users ?? routeUsers;

  const handleCloseDetails = async () => {
    setShowDetails(false);
    if (fetchUsers) {
      fetchUsers();
      return;
    }
    const enrolledUsers = await getEnrolledUsers();
    setRouteUsers(enrolledUsers);
  };

  const handleUserUpdated = async (updatedUser: any) => {
    if (fetchUsers) {
      fetchUsers();
      return;
    }
    setRouteUsers((prev) =>
      prev.map((user) => (user._id === updatedUser._id ? updatedUser : user)),
    );
  };

  return (
    <div id="wd-people-table">
      {showDetails && (
        <PeopleDetails
          uid={showUserId}
          onClose={handleCloseDetails}
          onUserUpdated={handleUserUpdated}
        />
      )}
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {tableUsers.map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <span
                  className="text-decoration-none"
                  onClick={() => {
                    setShowDetails(true);
                    setShowUserId(user._id);
                  }}
                >
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>{" "}
                  <span className="wd-last-name">{user.lastName}</span>
                </span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
