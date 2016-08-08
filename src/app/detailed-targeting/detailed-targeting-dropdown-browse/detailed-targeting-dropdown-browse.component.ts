import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { DetailedTargetingModeService } from '../detailed-targeting-mode/detailed-targeting-mode.service';
import { DetailedTargetingDropdownBrowseService } from './detailed-targeting-dropdown-browse.service';
import { DetailedTargetingApiService } from '../detailed-targeting-api/detailed-targeting-api.service';
import { DetailedTargetingSelectedService } from '../detailed-targeting-selected/detailed-targeting-selected.service';
import { DetailedTargetingItem } from '../detailed-targeting-item';
import { DetailedTargetingInfoService } from '../detailed-targeting-info/detailed-targeting-info.service';

@Component({
  moduleId: module.id,
  selector: 'detailed-targeting-dropdown-browse',
  templateUrl: 'detailed-targeting-dropdown-browse.component.html',
  styleUrls: ['detailed-targeting-dropdown-browse.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DetailedTargetingDropdownBrowseComponent implements OnInit {
  private mode;
  private items;
  private selectedItems;
  private openItems;

  constructor (private DetailedTargetingDropdownBrowseService: DetailedTargetingDropdownBrowseService,
               private DetailedTargetingApiService: DetailedTargetingApiService,
               private DetailedTargetingModeService: DetailedTargetingModeService,
               private DetailedTargetingSelectedService: DetailedTargetingSelectedService,
               private DetailedTargetingInfoService: DetailedTargetingInfoService,
               private ElementRef: ElementRef,
               private ref: ChangeDetectorRef) {
    this.openItems = this.DetailedTargetingDropdownBrowseService.getOpenItems();
  }

  /**
   * Trigger change detection mechanism that updates component's template
   */
  private updateTemplate () {
    this.ref.markForCheck();
    this.ref.detectChanges();
  }

  /**
   * If branch is closed, than close all it's children as well
   * @param item
   * @param openItems
   * @param openKeys
   */
  private closeChildrenNodes (item, openItems, openKeys) {
    if (openItems[item.key]) {
      return;
    }
    openKeys.forEach(key => {
      if (key.indexOf(item.key) > -1) {
        openItems[key] = false;
      }
    });
  }

  private getScrollToItemKey (item, openItems) {
    if (openItems[item.key]) {
      return item.key;
    } else {
      let lastIndex = item.key.lastIndexOf(' > ');
      return item.key.slice(0, lastIndex > -1 ? lastIndex : item.key.length);
    }
  }

  /**
   * Open or close browse rows when clicked
   * @param item
   */
  private toggleBranch (item: DetailedTargetingItem) {
    //Get all open keys
    let openItems = this.DetailedTargetingDropdownBrowseService.getOpenItems();
    let openKeys = Object.keys(openItems);

    //Toggle branch by item.key
    openItems[item.key] = !Boolean(openItems[item.key]);

    //Toggle Nodes
    this.closeChildrenNodes(item, openItems, openKeys);

    //Decide where to scroll
    openItems._scrollTo = this.getScrollToItemKey(item, openItems);

    this.DetailedTargetingDropdownBrowseService.updateOpenItems(openItems);
  }

  /**
   * Select row item from the browse list
   * @param item
   */
  private selectItem (item: DetailedTargetingItem) {
    let selectedItems = this.DetailedTargetingSelectedService.get();

    let alreadyAdded: boolean = Boolean(selectedItems.filter(selected => selected.id === item.id).length);

    if (!alreadyAdded) {
      selectedItems.push(item);
    }

    this.DetailedTargetingSelectedService.updateSelected(selectedItems);
  }

  /**
   * Remove row item from previously selected
   * @param itemToRemove
   */
  private removeItem (itemToRemove: DetailedTargetingItem) {
    let selectedItems = this.DetailedTargetingSelectedService.get();

    selectedItems = selectedItems.filter(item => item.id !== itemToRemove.id);

    this.DetailedTargetingSelectedService.updateSelected(selectedItems);
  }

  /**
   * Show row's info when hovered
   * @param item
   */
  public setDropdownInfoItem (item: DetailedTargetingItem) {
    let value = item && item.id ? item : null;
    this.DetailedTargetingInfoService.update(value);
  }

  public clickItem (item: DetailedTargetingItem) {
    if (!item.id) {
      this.toggleBranch(item);
    } else {
      if (this.selectedItems && this.selectedItems.indexOf(item.id) > -1) {
        this.removeItem(item);
      } else {
        this.selectItem(item);
      }
    }
  };

  public scrollTo (key) {
    if (!key) {
      return;
    }

    let elm = this.ElementRef.nativeElement;
    let list = elm.querySelector('ul');
    let itemRow = elm.querySelector(`[data-key="${key}"]`);

    if (itemRow) {
      list.scrollTop = itemRow.offsetTop;
    }
  }

  ngOnInit () {
    //TODO: rethink how to make request without timeout
    setTimeout(() => {
      //Load browse items
      this.DetailedTargetingApiService.browse();
    }, 1000);
    /**
     * Update dropdown list when new items to browse
     */
    this.DetailedTargetingDropdownBrowseService.items.subscribe(items => {
      this.items = items;

      this.updateTemplate();
    });

    /**
     * Update items from dropdown (toggle checkboxes) when selected items changes
     */
    this.DetailedTargetingSelectedService.items
        .map((items: DetailedTargetingItem[]) => items.map(item => item.id))
        .subscribe((selectedItems: Array<string>) => {
          this.selectedItems = selectedItems;

          this.updateTemplate();
        });

    /**
     * Toggle mode if changed
     */
    this.DetailedTargetingModeService.mode.subscribe((mode: string) => {
      this.mode = mode;

      this.updateTemplate();
    });

    this.DetailedTargetingDropdownBrowseService.openItems.subscribe((openItems) => {
      this.openItems = openItems;
      this.updateTemplate();
      setTimeout(() => {
        this.scrollTo(openItems._scrollTo);
      });
    });
  }

}
