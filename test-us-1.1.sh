#!/bin/bash

# Test script for US-1.1: User Registration
# This script tests the user registration functionality using curl commands

# Configuration
API_URL="http://localhost:5002/api/v1"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test$TIMESTAMP@example.com"
TEST_PASSWORD="Test1234"
TEST_NAME="Test User"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 TESTING US-1.1: USER REGISTRATION${NC}"
echo -e "${BLUE}====================================${NC}"

# Test 1: Register a new user
echo -e "\n${BLUE}📝 TEST 1: Register a new user with valid credentials${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$TEST_NAME\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
  -c cookies.txt \
  -w "\n%{http_code}")

HTTP_STATUS=$(echo "$REGISTER_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$REGISTER_RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" -eq 201 ]; then
  echo -e "${GREEN}✅ User registration successful${NC}"
  echo -e "   - Name: $TEST_NAME"
  echo -e "   - Email: $TEST_EMAIL"
  echo -e "   - Response: $RESPONSE_BODY"
  
  # Check if token is in cookies
  if grep -q "token" cookies.txt; then
    echo -e "${GREEN}✅ Token cookie set successfully${NC}"
  else
    echo -e "${RED}❌ No token cookie found${NC}"
  fi
else
  echo -e "${RED}❌ User registration failed with status $HTTP_STATUS${NC}"
  echo -e "   - Response: $RESPONSE_BODY"
fi

# Test 2: Try to register with the same email (should fail)
echo -e "\n${BLUE}📝 TEST 2: Register with an existing email (should fail)${NC}"
DUPLICATE_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$TEST_NAME\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
  -w "\n%{http_code}")

HTTP_STATUS=$(echo "$DUPLICATE_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$DUPLICATE_RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" -eq 400 ]; then
  echo -e "${GREEN}✅ Duplicate registration correctly rejected${NC}"
  echo -e "   - Status: $HTTP_STATUS"
  echo -e "   - Response: $RESPONSE_BODY"
else
  echo -e "${RED}❌ Test failed: Should not allow duplicate registration${NC}"
  echo -e "   - Status: $HTTP_STATUS"
  echo -e "   - Response: $RESPONSE_BODY"
fi

# Test 3: Try to register with invalid password (missing uppercase)
echo -e "\n${BLUE}📝 TEST 3: Register with invalid password (missing uppercase)${NC}"
INVALID_EMAIL="invalid$TIMESTAMP@example.com"
INVALID_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$TEST_NAME\",\"email\":\"$INVALID_EMAIL\",\"password\":\"test1234\"}" \
  -w "\n%{http_code}")

HTTP_STATUS=$(echo "$INVALID_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$INVALID_RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" -eq 400 ]; then
  echo -e "${GREEN}✅ Invalid password correctly rejected${NC}"
  echo -e "   - Status: $HTTP_STATUS"
  echo -e "   - Response: $RESPONSE_BODY"
else
  echo -e "${RED}❌ Test failed: Should not allow password without uppercase letter${NC}"
  echo -e "   - Status: $HTTP_STATUS"
  echo -e "   - Response: $RESPONSE_BODY"
fi

# Test 4: Try to register with missing required fields
echo -e "\n${BLUE}📝 TEST 4: Register with missing required fields${NC}"
INCOMPLETE_EMAIL="incomplete$TIMESTAMP@example.com"
INCOMPLETE_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$INCOMPLETE_EMAIL\"}" \
  -w "\n%{http_code}")

HTTP_STATUS=$(echo "$INCOMPLETE_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$INCOMPLETE_RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" -eq 400 ]; then
  echo -e "${GREEN}✅ Incomplete registration correctly rejected${NC}"
  echo -e "   - Status: $HTTP_STATUS"
  echo -e "   - Response: $RESPONSE_BODY"
else
  echo -e "${RED}❌ Test failed: Should not allow registration with missing fields${NC}"
  echo -e "   - Status: $HTTP_STATUS"
  echo -e "   - Response: $RESPONSE_BODY"
fi

# Test 5: Test Google OAuth endpoint
echo -e "\n${BLUE}📝 TEST 5: Test Google OAuth endpoint${NC}"
GOOGLE_EMAIL="google$TIMESTAMP@example.com"
GOOGLE_RESPONSE=$(curl -s -X POST "$API_URL/auth/google" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$GOOGLE_EMAIL\",\"idToken\":\"mock-google-id-token\",\"name\":\"Google User\",\"avatar\":\"https://example.com/avatar.jpg\"}" \
  -c google_cookies.txt \
  -w "\n%{http_code}")

HTTP_STATUS=$(echo "$GOOGLE_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$GOOGLE_RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo -e "${GREEN}✅ Google OAuth registration successful${NC}"
  echo -e "   - Email: $GOOGLE_EMAIL"
  echo -e "   - Response: $RESPONSE_BODY"
  
  # Check if token is in cookies
  if grep -q "token" google_cookies.txt; then
    echo -e "${GREEN}✅ Token cookie set successfully${NC}"
  else
    echo -e "${RED}❌ No token cookie found${NC}"
  fi
else
  echo -e "${RED}❌ Google OAuth registration failed with status $HTTP_STATUS${NC}"
  echo -e "   - Response: $RESPONSE_BODY"
fi

# Clean up
rm -f cookies.txt google_cookies.txt

echo -e "\n${BLUE}====================================${NC}"
echo -e "${GREEN}✅ TESTS COMPLETED${NC}"
echo -e "${BLUE}====================================${NC}"