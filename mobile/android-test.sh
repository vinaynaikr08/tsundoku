#!/usr/bin/env bash

# Start expo bundler in background and record PID
npx expo start &
expo_bundler_pid=$!

# Wait for bundler, then run tests
sleep 5 && npx detox test --configuration android.emu.debug --headless

# Cleanup, kill expo bundler
kill "$expo_bundler_pid"
