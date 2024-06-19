import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

/** YAM API Class
 *
 * Static class for YAM frontend to get/send data to the yam backend API.
 */

class YamAPI {
  /** static token
   *
   * The JWT will be stored here. This is what is used for interacting with the API.
   *
   * The token will be used to authenticate API requests
   *
   * Included in the header: "`Authorization`" : "`Bearer ${token}`"
   */
  static token;

  /** static async request
   *
   * Sends a request to the API.
   *
   * @param {string} endpoint - The API endpoint to send the request to.
   * @param {object} [data={}] - The data to be sent with the request. This can include `req.body`. Defaults to an empty object if no data is provided.
   * @param {string} [method="get"] - The HTTP method to use for the request. Defaults to "get" if no method is specified.
   *
   * @returns {Promise<object>} - The data from the API response.
   *
   * @throws {Array<string>} - An array of error messages if the request fails.
   *
   * @example
   * // Make a GET request to 'users/1'
   * const userData = await YamApi.request('users/1');
   *
   * @example
   * // Make a POST request to 'users/register' with user data
   * const newUser = await YamApi.request('users/register', { username: 'abc', password: '123' }, 'post');
   */
  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${YamAPI.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (error) {
      let message = error.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /** Get the current user. */
  static async getCurrentUser(userId) {
    let response = await this.request(`users/${userId}`);
    return response.user;
  }

  /** static async register
   *
   * Registers a new user. Returns JWT
   */
  static async register(userData) {
    let response = await this.request("users/register", userData, "post");
    return response.token;
  }

  /** static async login
   *
   * Logs in a user. Returns JWT
   */
  static async login(loginData) {
    let response = await this.request("users/login", loginData, "post");
    return response.token;
  }

  /** static async getAllSalesInfo
   *
   * Get all sales for a specific user, including direct sales and business sales..
   */
  static async getAllSalesInfo(userId) {
    let response = await this.request(`users/${userId}/allSalesInfo`);
    return response.sales;
  }

  /** static async getAllUsers
   *
   * Retrieves all users.
   */
  static async getAllUsers() {
    const response = await this.request("users");
    return response.users;
  }

  /** static async getUserById
   *
   * Retrieves a user by ID.
   */
  static async getUserById(userId) {
    const response = await this.request(`users/${userId}`);
    return response.user;
  }

  /** static async updateUser
   *
   * Updates a user's information.
   */
  static async updateUser(userId, updateData) {
    const response = await this.request(`users/${userId}`, updateData, "patch");
    return response.user;
  }

  /** static async deleteUser
   *
   * Deletes a user.
   */
  static async deleteUser(userId) {
    return await this.request(`users/${userId}`, {}, "delete");
  }

  /** static async getUserSales
   *
   * Retrieves all sales for a specific user.
   */
  static async getUserSales(userId) {
    const response = await this.request(`users/${userId}/sales`);
    return response.sales;
  }

  /** static async getUserBusinessSales
   *
   * Retrieves all business sales for a specific user.
   */
  static async getUserBusinessSales(userId) {
    const response = await this.request(`users/${userId}/businessSales`);
    return response.businessSales;
  }

  /** static async createProduct
   *
   * Creates a new product.
   */
  static async createProduct(userId, productData) {
    const response = await this.request(
      `users/${userId}/products`,
      productData,
      "post"
    );
    return response.product;
  }

  /** static async getAllProducts
   *
   * Retrieves all products for a given user.
   */
  static async getAllProducts(userId) {
    let response = await this.request(`users/${userId}/products`);
    return response.products;
  }

  /** static async getProductById
   *
   * Retrieves a product by ID for a given user.
   */
  static async getProductById(userId, productId) {
    let response = await this.request(`users/${userId}/products/${productId}`);
    return response.product;
  }

  /** static async updateProduct
   *
   * Updates a product's information.
   */
  static async updateProduct(userId, productId, updateData) {
    let response = await this.request(
      `users/${userId}/products/${productId}`,
      updateData,
      "patch"
    );
    return response.product;
  }

  /** static async deleteProduct
   *
   * Deletes a product.
   */
  static async deleteProduct(userId, productId) {
    return await this.request(
      `users/${userId}/products/${productId}`,
      {},
      "delete"
    );
  }

  /** static async createSale
   *
   * Creates a new sale.
   */
  static async createSale(productId, saleData) {
    const response = await this.request(
      `products/${productId}/sales`,
      saleData,
      "post"
    );
    return response.sale;
  }

  /** static async getAllSales
   *
   * Retrieves all sales for a given product.
   */
  static async getAllSales(productId) {
    const response = await this.request(`products/${productId}/sales`);
    return response.sales;
  }

  /** static async getSaleById
   *
   * Retrieves a sale by ID for a given product.
   */
  static async getSaleById(productId, saleId) {
    const response = await this.request(
      `products/${productId}/sales/${saleId}`
    );
    return response.sale;
  }

  /** static async updateSale
   *
   * Updates a sale's information.
   */
  static async updateSale(productId, saleId, updateData) {
    const response = await this.request(
      `products/${productId}/sales/${saleId}`,
      updateData,
      "patch"
    );
    return response.sale;
  }

  /** static async deleteSale
   *
   * Deletes a sale.
   */
  static async deleteSale(productId, saleId) {
    return await this.request(
      `products/${productId}/sales/${saleId}`,
      {},
      "delete"
    );
  }

  /** static async createBusiness
   *
   * Creates a new business.
   */
  static async createBusiness(userId, businessData) {
    const response = await this.request(
      `users/${userId}/businesses`,
      businessData,
      "post"
    );
    return response.business;
  }

  /** static async getAllBusinesses
   *
   * Retrieves all businesses for a given user.
   */
  static async getAllBusinesses(userId) {
    const response = await this.request(`users/${userId}/businesses`);
    return response.businesses;
  }

  /** static async getBusinessById
   *
   * Retrieves a business by ID for a given user.
   */
  static async getBusinessById(userId, businessId) {
    const response = await this.request(
      `users/${userId}/businesses/${businessId}`
    );
    return response.business;
  }

  /** static async updateBusiness
   *
   * Updates a business's information.
   */
  static async updateBusiness(userId, businessId, updateData) {
    const response = await this.request(
      `users/${userId}/businesses/${businessId}`,
      updateData,
      "patch"
    );
    return response.business;
  }

  /** static async deleteBusiness
   *
   * Deletes a business.
   */
  static async deleteBusiness(userId, businessId) {
    return await this.request(
      `users/${userId}/businesses/${businessId}`,
      {},
      "delete"
    );
  }

  /** static async createBusinessSale
   *
   * Creates a new business sale.
   */
  static async createBusinessSale(businessId, businessSaleData) {
    const response = await this.request(
      `businesses/${businessId}/businessSales`,
      businessSaleData,
      "post"
    );
    return response.businessSale;
  }

  /** static async getAllBusinessSales
   *
   * Retrieves all business sales for a given business.
   */
  static async getAllBusinessSales(businessId) {
    const response = await this.request(
      `businesses/${businessId}/businessSales`
    );
    return response.businesses;
  }

  /** static async getBusinessSaleById
   *
   * Retrieves a business sale by ID for a given business.
   */
  static async getBusinessSaleById(businessId, businessSaleId) {
    const response = await this.request(
      `businesses/${businessId}/businessSales/${businessSaleId}`
    );
    return response.businessSale;
  }

  /** static async updateBusinessSale
   *
   * Updates a business sale's information.
   */
  static async updateBusinessSale(businessId, businessSaleId, updateData) {
    const response = await this.request(
      `businesses/${businessId}/businessSales/${businessSaleId}`,
      updateData,
      "patch"
    );
    return response.businessSale;
  }

  /** static async deleteBusinessSale
   *
   * Deletes a business sale.
   */
  static async deleteBusinessSale(businessId, businessSaleId) {
    return await this.request(
      `businesses/${businessId}/businessSales/${businessSaleId}`,
      {},
      "delete"
    );
  }
}

export default YamAPI;
