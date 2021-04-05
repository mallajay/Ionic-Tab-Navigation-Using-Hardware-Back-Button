import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonRouterOutlet,
  NavController,
  Platform,
} from '@ionic/angular';
import { NavigationStart, Router } from '@angular/router';

import { Plugins } from '@capacitor/core';
import { AutocloseOverlaysService } from './providers/AutocloseOverlays/autoclose-overlays.service';
import { PlatformLocation } from '@angular/common';
const { App, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild(IonRouterOutlet, { static: false }) routerOutlets: IonRouterOutlet;

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home',
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list',
    },
    {
      title: 'Admin',
      url: '/admin',
      icon: 'cube',
    },
    {
      title: 'Your Account',
      url: '/account',
      icon: 'person',
    },
  ];

  constructor(
    private platform: Platform,

    private router: Router,
    private autocloseOverlaysService: AutocloseOverlaysService,
    private location: PlatformLocation,
    private alertController: AlertController,
    public navCtrl: NavController
  ) {
    this.initializeApp();

    this.router.events.subscribe((event: any): void => {
      if (event instanceof NavigationStart) {
        this.location.onPopState(async () => {
          this.autocloseOverlaysService.trigger();
        });
      }
    });
  }

  ngOnInit() {}

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.setBackgroundColor({ color: '#227aff' });
    });

    this.platform.backButton.subscribeWithPriority(5, (processNextHandler) => {
      if (this.routerOutlets && this.routerOutlets.canGoBack()) {
        this.routerOutlets.pop();
      }
      if (this.router.url === '/tabs/tab1') {
        processNextHandler();
      }

      this.navCtrl.back();
    });

    this.platform.backButton.subscribeWithPriority(0, async () => {
      const aleart = await this.alertController.create({
        header: 'Close App',
        message: 'Do you really want to close the app?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Close App',
            handler: () => {
              App.exitApp();
            },
          },
        ],
      });

      await aleart.present();
    });
  }
}
