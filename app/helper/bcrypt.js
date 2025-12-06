import bcrypt from 'bcrypt';

/**
 * Hash a password synchronously
 * @param {string} password - Plain text password to hash
 * @param {number} saltRounds - Number of salt rounds for hashing (default: 10)
 * @returns {string} - Hashed password
 */
export const hashPasswordSync = (password, saltRounds = 10) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

/**
 * Compare a password with a hash synchronously
 * @param {string} password - Plain text password to compare
 * @param {string} hash - Hashed password to compare against
 * @returns {boolean} - True if password matches the hash
 */
export const comparePasswordSync = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

/**
 * Check if a hash needs rehashing synchronously (useful for updating hash strength)
 * @param {string} hash - Hash to check
 * @param {number} saltRounds - Salt rounds to check against
 * @returns {boolean} - True if rehash is needed
 */
export const needsRehashSync = (hash, saltRounds = 10) => {
  return bcrypt.getRounds(hash) < saltRounds;
};