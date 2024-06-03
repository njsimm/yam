import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5173";

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
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${YamAPI.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (error) {
      console.error("API Error:", error.response);
      let message = error.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /** static async registerUser
   *
   * Registers a new user.
   */
  static async registerUser(userData) {
    return await this.request("users/register", userData, "post");
  }

  /** static async loginUser
   *
   * Logs in a user.
   */
  static async loginUser(loginData) {
    return await this.request("users/login", loginData, "post");
  }

  /** static async getAllUsers
   *
   * Retrieves all users.
   */
  static async getAllUsers() {
    return await this.request("users");
  }

  /** static async getUserById
   *
   * Retrieves a user by ID.
   */
  static async getUserById(userId) {
    return await this.request(`users/${userId}`);
  }

  /** static async updateUser
   *
   * Updates a user's information.
   */
  static async updateUser(userId, updateData) {
    return await this.request(`users/${userId}`, updateData, "patch");
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
    return await this.request(`users/${userId}/sales`);
  }

  /** static async getUserBusinessSales
   *
   * Retrieves all business sales for a specific user.
   */
  static async getUserBusinessSales(userId) {
    return await this.request(`users/${userId}/businessSales`);
  }

  /** static async createProduct
   *
   * Creates a new product.
   */
  static async createProduct(userId, productData) {
    return await this.request(`users/${userId}/products`, productData, "post");
  }

  /** static async getAllProducts
   *
   * Retrieves all products for a given user.
   */
  static async getAllProducts(userId) {
    return await this.request(`users/${userId}/products`);
  }

  /** static async getProductById
   *
   * Retrieves a product by ID for a given user.
   */
  static async getProductById(userId, productId) {
    return await this.request(`users/${userId}/products/${productId}`);
  }

  /** static async updateProduct
   *
   * Updates a product's information.
   */
  static async updateProduct(userId, productId, updateData) {
    return await this.request(
      `users/${userId}/products/${productId}`,
      updateData,
      "patch"
    );
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
    return await this.request(`products/${productId}/sales`, saleData, "post");
  }

  /** static async getAllSales
   *
   * Retrieves all sales for a given product.
   */
  static async getAllSales(productId) {
    return await this.request(`products/${productId}/sales`);
  }

  /** static async getSaleById
   *
   * Retrieves a sale by ID for a given product.
   */
  static async getSaleById(productId, saleId) {
    return await this.request(`products/${productId}/sales/${saleId}`);
  }

  /** static async updateSale
   *
   * Updates a sale's information.
   */
  static async updateSale(productId, saleId, updateData) {
    return await this.request(
      `products/${productId}/sales/${saleId}`,
      updateData,
      "patch"
    );
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
    return await this.request(
      `users/${userId}/businesses`,
      businessData,
      "post"
    );
  }

  /** static async getAllBusinesses
   *
   * Retrieves all businesses for a given user.
   */
  static async getAllBusinesses(userId) {
    return await this.request(`users/${userId}/businesses`);
  }

  /** static async getBusinessById
   *
   * Retrieves a business by ID for a given user.
   */
  static async getBusinessById(userId, businessId) {
    return await this.request(`users/${userId}/businesses/${businessId}`);
  }

  /** static async updateBusiness
   *
   * Updates a business's information.
   */
  static async updateBusiness(userId, businessId, updateData) {
    return await this.request(
      `users/${userId}/businesses/${businessId}`,
      updateData,
      "patch"
    );
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
    return await this.request(
      `businesses/${businessId}/businessSales`,
      businessSaleData,
      "post"
    );
  }

  /** static async getAllBusinessSales
   *
   * Retrieves all business sales for a given business.
   */
  static async getAllBusinessSales(businessId) {
    return await this.request(`businesses/${businessId}/businessSales`);
  }

  /** static async getBusinessSaleById
   *
   * Retrieves a business sale by ID for a given business.
   */
  static async getBusinessSaleById(businessId, businessSaleId) {
    return await this.request(
      `businesses/${businessId}/businessSales/${businessSaleId}`
    );
  }

  /** static async updateBusinessSale
   *
   * Updates a business sale's information.
   */
  static async updateBusinessSale(businessId, businessSaleId, updateData) {
    return await this.request(
      `businesses/${businessId}/businessSales/${businessSaleId}`,
      updateData,
      "patch"
    );
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
