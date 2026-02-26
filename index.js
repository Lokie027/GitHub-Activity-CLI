#!/usr/bin/env node

import fetch from "node-fetch";

const username = process.argv[2];

if (!username) {
  console.log("Please provide a GitHub username");
  console.log("Usage: github-activity <username>");
  process.exit(1);
}

const url = `https://api.github.com/users/${username}/events`;

async function getActivity() {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.log("User not found or API error!");
      return;
    }

    const events = await res.json();

    if (events.length === 0) {
      console.log("No recent activity found.");
      return;
    }

    console.log(`\nRecent activity for ${username}:\n`);

    events.slice(0, 10).forEach((event, i) => {
      console.log(`${i + 1}. ${formatEvent(event)}`);
    });
  } catch (err) {
    console.error("Error:", err.message);
  }
}

function formatEvent(event) {
  switch (event.type) {
    case "PushEvent":
      return `Pushed to ${event.repo.name}`;
    case "IssuesEvent":
      return `${event.payload.action} issue in ${event.repo.name}`;
    case "WatchEvent":
      return `Starred ${event.repo.name}`;
    case "ForkEvent":
      return `Forked ${event.repo.name}`;
    case "PullRequestEvent":
      return `${event.payload.action} PR in ${event.repo.name}`;
    default:
      return `${event.type} on ${event.repo.name}`;
  }
}
getActivity();