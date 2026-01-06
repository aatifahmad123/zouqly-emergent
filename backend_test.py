import requests
import sys
import json
from datetime import datetime

class ZouqlyAPITester:
    def __init__(self, base_url="https://zouqly-market.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.admin_token = None
        self.user_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f" (Expected: {expected_status})"
                try:
                    error_data = response.json()
                    details += f" - {error_data.get('detail', 'Unknown error')}"
                except:
                    details += f" - {response.text[:100]}"

            self.log_test(name, success, details)
            
            if success:
                try:
                    return response.json()
                except:
                    return {}
            return None

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return None

    def test_health_check(self):
        """Test basic API health"""
        print("\n🔍 Testing API Health...")
        self.run_test("API Health Check", "GET", "health", 200)
        self.run_test("API Root", "GET", "", 200)

    def test_public_endpoints(self):
        """Test public endpoints that don't require authentication"""
        print("\n🔍 Testing Public Endpoints...")
        
        # Test categories
        categories = self.run_test("Get Categories", "GET", "categories", 200)
        
        # Test products
        products = self.run_test("Get Products", "GET", "products", 200)
        
        # Test testimonials
        testimonials = self.run_test("Get Testimonials", "GET", "testimonials", 200)
        
        # Test content
        self.run_test("Get About Content", "GET", "content/about", 200)
        
        # Test individual product if products exist
        if products and len(products) > 0:
            product_id = products[0]['id']
            self.run_test("Get Single Product", "GET", f"products/{product_id}", 200)
        
        return categories, products, testimonials

    def test_authentication_required_endpoints(self):
        """Test endpoints that require authentication but no admin role"""
        print("\n🔍 Testing Authentication Required Endpoints...")
        
        # Test without token (should fail)
        self.run_test("Get Orders (No Auth)", "GET", "orders", 401)
        
        # Test with invalid token (should fail)
        invalid_headers = {'Authorization': 'Bearer invalid_token'}
        self.run_test("Get Orders (Invalid Auth)", "GET", "orders", 401, headers=invalid_headers)

    def test_admin_required_endpoints(self):
        """Test endpoints that require admin role"""
        print("\n🔍 Testing Admin Required Endpoints...")
        
        # Test admin endpoints without auth (should fail)
        self.run_test("Create Category (No Auth)", "POST", "categories", 401, 
                     data={"name": "Test Category", "description": "Test"})
        
        self.run_test("Create Product (No Auth)", "POST", "products", 401,
                     data={"name": "Test Product", "weight": "100g", "price": 10.0, 
                           "description": "Test", "features": [], "category_id": "test", "tags": []})
        
        self.run_test("Create Testimonial (No Auth)", "POST", "testimonials", 401,
                     data={"name": "Test User", "rating": 5, "comment": "Great!"})

    def test_data_validation(self):
        """Test API data validation"""
        print("\n🔍 Testing Data Validation...")
        
        # Test invalid product data
        self.run_test("Create Product (Invalid Data)", "POST", "products", 422,
                     data={"name": "", "price": "invalid"})
        
        # Test invalid testimonial rating
        self.run_test("Create Testimonial (Invalid Rating)", "POST", "testimonials", 422,
                     data={"name": "Test", "rating": 10, "comment": "Test"})

    def test_not_found_endpoints(self):
        """Test 404 scenarios"""
        print("\n🔍 Testing Not Found Scenarios...")
        
        # Test non-existent product
        self.run_test("Get Non-existent Product", "GET", "products/non-existent-id", 404)
        
        # Test non-existent content
        self.run_test("Get Non-existent Content", "GET", "content/non-existent-page", 200)  # Returns empty content

    def run_comprehensive_test(self):
        """Run all tests"""
        print("🚀 Starting Zouqly API Comprehensive Testing...")
        print(f"Testing against: {self.base_url}")
        
        # Test basic functionality
        self.test_health_check()
        
        # Test public endpoints
        categories, products, testimonials = self.test_public_endpoints()
        
        # Test authentication requirements
        self.test_authentication_required_endpoints()
        
        # Test admin requirements
        self.test_admin_required_endpoints()
        
        # Test data validation
        self.test_data_validation()
        
        # Test not found scenarios
        self.test_not_found_endpoints()
        
        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        # Print failed tests
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print(f"\n❌ Failed Tests ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['details']}")
        
        return {
            'total_tests': self.tests_run,
            'passed_tests': self.tests_passed,
            'failed_tests': len(failed_tests),
            'success_rate': (self.tests_passed/self.tests_run)*100,
            'failed_test_details': failed_tests,
            'categories_count': len(categories) if categories else 0,
            'products_count': len(products) if products else 0,
            'testimonials_count': len(testimonials) if testimonials else 0
        }

def main():
    tester = ZouqlyAPITester()
    results = tester.run_comprehensive_test()
    
    # Return appropriate exit code
    return 0 if results['success_rate'] > 80 else 1

if __name__ == "__main__":
    sys.exit(main())