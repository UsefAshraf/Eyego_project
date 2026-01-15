// Interface for repository (contract)
class IActivityRepository {
  async save(activity) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findAll(filters, pagination) {
    throw new Error('Method not implemented');
  }
}

module.exports = IActivityRepository;