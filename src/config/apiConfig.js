/**
 * API Configuration
 * All API URLs are loaded from environment variables
 */

const config = {
  // Base URL
  baseUrl: process.env.REACT_APP_BASE_URL,

  // Authentication APIs
  userLoginUrl: process.env.REACT_APP_USER_LOGIN_URL,

  // Account Management APIs
  createAccountUrl: process.env.REACT_APP_CREATE_ACCOUNT_URL,
  balanceCheckUrl: process.env.REACT_APP_BALANCE_CHECK_URL,
  getAccountsByCustomerUrl: process.env.REACT_APP_GET_ACCOUNTS_BY_CUSTOMER_URL,
  changeAccountStatusUrl: process.env.REACT_APP_CHANGE_ACCOUNT_STATUS_URL,

  // Beneficiary Management APIs
  addBeneficiaryUrl: process.env.REACT_APP_ADD_BENEFICIARY_URL,
  getBeneficiariesUrl: process.env.REACT_APP_GET_BENEFICIARIES_URL,
  getActiveBeneficiariesUrl: process.env.REACT_APP_GET_ACTIVE_BENEFICIARIES_URL,
  updateBeneficiaryUrl: process.env.REACT_APP_UPDATE_BENEFICIARY_URL,
  deleteBeneficiaryUrl: process.env.REACT_APP_DELETE_BENEFICIARY_URL,

  // Loan Management APIs
  applyLoanUrl: process.env.REACT_APP_APPLY_LOAN_URL,
  approveLoanUrl: process.env.REACT_APP_APPROVE_LOAN_URL,
  rejectLoanUrl: process.env.REACT_APP_REJECT_LOAN_URL,
  disburseLoanUrl: process.env.REACT_APP_DISBURSE_LOAN_URL,
  makeLoanPaymentUrl: process.env.REACT_APP_MAKE_LOAN_PAYMENT_URL,
  getLoansByCustomerUrl: process.env.REACT_APP_GET_LOANS_BY_CUSTOMER_URL,
  getLoanDetailsUrl: process.env.REACT_APP_GET_LOAN_DETAILS_URL,
  getLoanPaymentHistoryUrl: process.env.REACT_APP_GET_LOAN_PAYMENT_HISTORY_URL,

  // Standing Instruction APIs
  createStandingInstructionUrl:
    process.env.REACT_APP_CREATE_STANDING_INSTRUCTION_URL,
  getStandingInstructionsUrl:
    process.env.REACT_APP_GET_STANDING_INSTRUCTIONS_URL,
  getActiveStandingInstructionsUrl:
    process.env.REACT_APP_GET_ACTIVE_STANDING_INSTRUCTIONS_URL,
  pauseStandingInstructionUrl:
    process.env.REACT_APP_PAUSE_STANDING_INSTRUCTION_URL,
  resumeStandingInstructionUrl:
    process.env.REACT_APP_RESUME_STANDING_INSTRUCTION_URL,
  cancelStandingInstructionUrl:
    process.env.REACT_APP_CANCEL_STANDING_INSTRUCTION_URL,

  // Transaction APIs
  depositUrl: process.env.REACT_APP_DEPOSIT_URL,
  withdrawUrl: process.env.REACT_APP_WITHDRAW_URL,
  transferUrl: process.env.REACT_APP_TRANSFER_URL,
  transactionHistoryUrl: process.env.REACT_APP_TRANSACTION_HISTORY_URL,
  transactionHistoryPaginatedUrl:
    process.env.REACT_APP_TRANSACTION_HISTORY_PAGINATED_URL,
  transactionHistoryByDateUrl:
    process.env.REACT_APP_TRANSACTION_HISTORY_BY_DATE_URL,
  transactionHistoryByTypeUrl:
    process.env.REACT_APP_TRANSACTION_HISTORY_BY_TYPE_URL,
  getTransactionByIdUrl: process.env.REACT_APP_GET_TRANSACTION_BY_ID_URL,
  getRecentTransactionsUrl: process.env.REACT_APP_GET_RECENT_TRANSACTIONS_URL,

  // User Management APIs
  createUserUrl: process.env.REACT_APP_CREATE_USER_URL,
  getAllUsersUrl: process.env.REACT_APP_GET_ALL_USERS_URL,
  getUserByIdUrl: process.env.REACT_APP_GET_USER_BY_ID_URL,
  updateUserUrl: process.env.REACT_APP_UPDATE_USER_URL,
  deleteUserUrl: process.env.REACT_APP_DELETE_USER_URL,
  getRolesUrl: process.env.REACT_APP_GET_ROLES_URL,
  addRoleUrl: process.env.REACT_APP_ADD_ROLE_URL,
  getPermissionsUrl: process.env.REACT_APP_GET_PERMISSIONS_URL,
  changePasswordUrl: process.env.REACT_APP_CHANGE_PASSWORD_URL,
  updateUserRolesUrl: process.env.REACT_APP_UPDATE_USER_ROLES_URL,
  getUserStatsUrl: process.env.REACT_APP_GET_USER_STATS_URL,
  searchUsersUrl: process.env.REACT_APP_SEARCH_USERS_URL,
};

export default config;
