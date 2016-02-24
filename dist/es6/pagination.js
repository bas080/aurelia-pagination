import {bindable, inject, computedFrom} from 'aurelia-framework';
import {customElement} from 'aurelia-templating';
import {EntityManager} from 'spoonx/aurelia-orm';

@inject(EntityManager, Element)
@customElement('pagination')
export class Pagination {
  @bindable page;

  @bindable limit = 20;

  @bindable count = 0;

  @bindable pagechange = null;

  /**
   * Calculate number of pages whenever 'count' or 'limit' is updated.
   *
   * @returns {number} page count
   */
  @computedFrom('count', 'limit')
  get pageCount () {
    return Math.ceil(this.count / this.limit);
  }

  /**
   * Create a new pagination element.
   *
   * @param {Entity} entityManager
   * @param {Element} element
   */
  constructor (entityManager, element) {
    this.entityManager = entityManager;
    this.element = element;
  }

  /**
   * Get resource, if exists initiate repository and update count.
   */
  attached () {
    this.resource = this.element.getAttribute('resource');
    if (!this.resource) {
      return;
    }
    this.repository = this.entityManager.getRepository(this.resource);
    this.updateRecordCount();
  }

  /**
   * Load previous page.
   */
  loadPrevious () {
    this.load(this.page - 1);
  }

  /**
   * Load next page.
   */
  loadNext () {
    this.load(this.page + 1);
  }

  /**
   * Load a page and call the pagechange function bind to the element if exists.
   *
   * @param page
   */
  load (page) {
    if (page === 0) {
      return;
    }

    page = page || 1;

    if (this.pageCount && page > this.pageCount) {
      return;
    }

    if (typeof this.pagechange === 'function') {
      this.pagechange({page:page})
        .then(() => {
          this.page = page;
        });
    }
    else {
      this.page = page;
    }

  }

  /**
   * Update record count fetching the repository.
   */
  updateRecordCount () {
    if (this.repository) {
      this.repository.count()
        .then(response => this.count = response.count)
        .catch(error => {
          throw new Error(`Error updating count : ${error}`);
        });
    }
  }

}
