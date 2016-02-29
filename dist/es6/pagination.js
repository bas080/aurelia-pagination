import {inject} from 'aurelia-dependency-injection';
import {computedFrom} from 'aurelia-binding';
import {bindable, customElement} from 'aurelia-templating';
import {EntityManager} from 'spoonx/aurelia-orm';

@inject(EntityManager, Element)
@customElement('pagination')
export class Pagination {
  @bindable page = 1;

  @bindable limit = 20;

  @bindable count = 0;

  @bindable pagechange = null;

  @bindable resource = null;

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
    if (!this.resource) {
      return;
    }
    this.repository = this.entityManager.getRepository(this.resource);
    this.updateRecordCount();
    this.load(this.page);
  }

  /**
   * Load previous page.
   */
  loadPrevious (step = 1) {
    this.load(Number(this.page) - step);
  }

  /**
   * Load next page.
   */
  loadNext (step = 1) {
    this.load(Number(this.page) + step);
  }

  /**
   * Load a page and call the pagechange function bind to the element if exists.
   *
   * @param page
   */
  load (page) {
    if (page <= 0) {
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
