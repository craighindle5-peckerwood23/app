#!/usr/bin/env python3
"""
FileSolved Backend API Testing Suite
Tests all backend endpoints for the document services platform
"""

import requests
import sys
import json
from datetime import datetime
from pathlib import Path
import tempfile
import os

class FileSolvedAPITester:
    def __init__(self, base_url="https://filesolved-1.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.session = requests.Session()
        
    def log_result(self, test_name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}")
        else:
            self.failed_tests.append({"test": test_name, "details": details})
            print(f"❌ {test_name} - {details}")
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Response: {data.get('status', 'unknown')}"
            self.log_result("Health Check", success, details)
            return success
        except Exception as e:
            self.log_result("Health Check", False, f"Exception: {str(e)}")
            return False
    
    def test_services_endpoint(self):
        """Test services listing endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/services", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                services = response.json()
                details += f", Services count: {len(services)}"
                # Verify expected services exist
                service_ids = [s.get('id') for s in services]
                expected_services = ['pdf-to-word', 'word-to-pdf', 'jpg-to-pdf', 'ocr', 'document-scan', 'pdf-fax', 'secure-shred']
                missing = [s for s in expected_services if s not in service_ids]
                if missing:
                    success = False
                    details += f", Missing services: {missing}"
            self.log_result("Services Listing", success, details)
            return success, response.json() if success else []
        except Exception as e:
            self.log_result("Services Listing", False, f"Exception: {str(e)}")
            return False, []
    
    def test_service_detail(self, service_id):
        """Test individual service detail endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/services/{service_id}", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                service = response.json()
                details += f", Service: {service.get('name', 'unknown')}"
            self.log_result(f"Service Detail ({service_id})", success, details)
            return success
        except Exception as e:
            self.log_result(f"Service Detail ({service_id})", False, f"Exception: {str(e)}")
            return False
    
    def test_file_upload(self):
        """Test file upload endpoint"""
        try:
            # Create a temporary test file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
                f.write("Test file content for FileSolved testing")
                temp_file_path = f.name
            
            with open(temp_file_path, 'rb') as f:
                files = {'file': ('test.txt', f, 'text/plain')}
                response = self.session.post(f"{self.base_url}/upload", files=files, timeout=30)
            
            # Clean up temp file
            os.unlink(temp_file_path)
            
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", File ID: {data.get('file_id', 'unknown')[:8]}..."
                return success, data
            else:
                details += f", Error: {response.text[:100]}"
                self.log_result("File Upload", success, details)
                return success, None
            
        except Exception as e:
            self.log_result("File Upload", False, f"Exception: {str(e)}")
            return False, None
    
    def test_order_creation(self, file_data, service_id="pdf-to-word"):
        """Test order creation endpoint"""
        if not file_data:
            self.log_result("Order Creation", False, "No file data available")
            return False, None
            
        try:
            form_data = {
                'service_id': service_id,
                'file_id': file_data['file_id'],
                'file_name': file_data['file_name'],
                'customer_email': 'test@filesolved.com',
                'customer_name': 'Test User'
            }
            
            response = self.session.post(f"{self.base_url}/orders/create", data=form_data, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                order = response.json()
                details += f", Order ID: {order.get('order_id', 'unknown')[:8]}..."
                self.log_result("Order Creation", success, details)
                return success, order
            else:
                details += f", Error: {response.text[:100]}"
                self.log_result("Order Creation", success, details)
                return success, None
                
        except Exception as e:
            self.log_result("Order Creation", False, f"Exception: {str(e)}")
            return False, None
    
    def test_order_retrieval(self, order_id):
        """Test order retrieval endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/orders/{order_id}", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                order = response.json()
                details += f", Status: {order.get('status', 'unknown')}"
            self.log_result("Order Retrieval", success, details)
            return success
        except Exception as e:
            self.log_result("Order Retrieval", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_login(self):
        """Test admin login endpoint"""
        try:
            login_data = {
                'email': 'admin@filesolved.com',
                'password': 'Admin123!'
            }
            
            response = self.session.post(f"{self.base_url}/admin/login", json=login_data, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                self.admin_token = data.get('token')
                details += f", Token received: {'Yes' if self.admin_token else 'No'}"
            else:
                details += f", Error: {response.text[:100]}"
            self.log_result("Admin Login", success, details)
            return success
        except Exception as e:
            self.log_result("Admin Login", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_analytics(self):
        """Test admin analytics endpoint"""
        if not self.admin_token:
            self.log_result("Admin Analytics", False, "No admin token available")
            return False
            
        try:
            headers = {'Authorization': f'Bearer {self.admin_token}'}
            response = self.session.get(f"{self.base_url}/admin/analytics", headers=headers, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                analytics = response.json()
                details += f", Revenue: ${analytics.get('total_revenue', 0)}, Orders: {analytics.get('total_orders', 0)}"
            else:
                details += f", Error: {response.text[:100]}"
            self.log_result("Admin Analytics", success, details)
            return success
        except Exception as e:
            self.log_result("Admin Analytics", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_orders(self):
        """Test admin orders endpoint"""
        if not self.admin_token:
            self.log_result("Admin Orders", False, "No admin token available")
            return False
            
        try:
            headers = {'Authorization': f'Bearer {self.admin_token}'}
            response = self.session.get(f"{self.base_url}/admin/orders", headers=headers, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                orders = data.get('orders', [])
                details += f", Orders count: {len(orders)}, Total: {data.get('total', 0)}"
            else:
                details += f", Error: {response.text[:100]}"
            self.log_result("Admin Orders", success, details)
            return success
        except Exception as e:
            self.log_result("Admin Orders", False, f"Exception: {str(e)}")
            return False
    
    def test_paypal_endpoints(self, order_id):
        """Test PayPal integration endpoints (creation only, not capture)"""
        if not order_id:
            self.log_result("PayPal Order Creation", False, "No order ID available")
            return False
            
        try:
            form_data = {'order_id': order_id}
            response = self.session.post(f"{self.base_url}/paypal/create-order", data=form_data, timeout=15)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", PayPal Order ID: {data.get('paypal_order_id', 'unknown')[:8]}..."
            else:
                details += f", Error: {response.text[:100]}"
            self.log_result("PayPal Order Creation", success, details)
            return success
        except Exception as e:
            self.log_result("PayPal Order Creation", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting FileSolved Backend API Tests")
        print(f"📍 Testing endpoint: {self.base_url}")
        print("=" * 60)
        
        # Basic connectivity tests
        health_ok = self.test_health_endpoint()
        services_ok, services_data = self.test_services_endpoint()
        
        # Test individual service details
        if services_data:
            for service in services_data[:3]:  # Test first 3 services
                self.test_service_detail(service.get('id'))
        
        # File upload and order flow
        upload_ok, file_data = self.test_file_upload()
        order_ok, order_data = False, None
        if upload_ok and file_data:
            order_ok, order_data = self.test_order_creation(file_data)
            if order_ok and order_data:
                self.test_order_retrieval(order_data.get('order_id'))
                self.test_paypal_endpoints(order_data.get('order_id'))
        
        # Admin functionality tests
        admin_login_ok = self.test_admin_login()
        if admin_login_ok:
            self.test_admin_analytics()
            self.test_admin_orders()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for failure in self.failed_tests:
                print(f"  • {failure['test']}: {failure['details']}")
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"\n🎯 Success Rate: {success_rate:.1f}%")
        
        return {
            'total_tests': self.tests_run,
            'passed_tests': self.tests_passed,
            'failed_tests': self.failed_tests,
            'success_rate': success_rate,
            'critical_failures': [f for f in self.failed_tests if any(keyword in f['test'].lower() for keyword in ['health', 'services', 'admin login'])]
        }

def main():
    """Main test execution"""
    tester = FileSolvedAPITester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    if results['success_rate'] < 70:
        print("\n🚨 Critical: Success rate below 70%")
        return 1
    elif results['critical_failures']:
        print("\n⚠️  Warning: Critical endpoints failing")
        return 1
    else:
        print("\n✅ Backend API tests completed successfully")
        return 0

if __name__ == "__main__":
    sys.exit(main())