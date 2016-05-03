import {inject} from 'aurelia-dependency-injection';
import {computedFrom} from 'aurelia-binding';
import {bindable, customElement} from 'aurelia-templating';
import {EntityManager} from 'spoonx/aurelia-orm';

@inject(EntityManager, Element)
@customElement('pagination')
export class Pagination {
  @bindable page = 1;

  /* the max amount of page numbers visible in the pagination */
  @bindable max = 20;

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
   * @returns {undefined}
   */
  load (page) {

    /* when the page is no longer valid default to first page */
   if (!isValidPage(page))
     page = 1;

   /* make sure the page number stays within bounds */
   page = pageToBorder(page);

    /* when border has been reached do not perform the pageChange */
    if (pageIsBorder(page))
      return;

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

  /**
   * returns a page representing a page number that is always within the
   * available page numbers
   * @param {number} page
   * @returns {number}
   */
  private pageToBorder (page) {
    /* reached the right limit */
    if (page > this.count)
      return this.count;

    /* reached the left limit */
    if (page < 1)
      return 1;

    /* has not reached a limit */
    return page;
  }

  /**
   * true when the page is a number and is within range
   *
   * @param {number} page
   * @return {boolean}
   */
  private isValidPage (page) {
    return (
      (typeof page === 'number') &&
      (page <= this.count) &&
      (page > 0)
    );
  }

  /**
   * true when the page is a border page 
   * @param {number} page
   * @return {boolean}
   */
  private pageIsBorder (page) {
    return (
      (page === 0) &&
      (page === this.count)
    );
  }

  /**
   * generates an array of the visible pages. It tries to center the current
   * page (this.page).
   *
   * @param {number} page
   * @returns {number[]}
   */
  visiblePages (page) {

    let pages = [];

    let length = Math.max(this.max, this.pageCount);

    let start = page - Math.max(length / 2, this.max);

    start = pageToBorder(start);

    for (let i = 0; i < length) {
      pages[i] = start + i;
    }

    return pages;
  }
}
