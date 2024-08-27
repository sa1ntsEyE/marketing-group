import {  Component, OnInit, ChangeDetectorRef, HostListener, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedTool: any = {};

  marketingTools = [
    {
      title: 'Targeted advertising',
      subtitle1: '<span class="white--text">We will conduct a comprehensive audit</span> of your current advertising campaigns and your competitors\' advertising communications,<span class="white--text">as well as provide recommendations for their improvement..</span> ',
      subtitle2: 'We will develop a detailed structure of advertising campaigns based on our experience in your industry and conducted audits. We will prepare commercial proposals and create advertising creatives for campaign implementation. We offer three types of reporting so you can track project details, our activities, and campaign progress.',
      subtitle3: '',
      textColor: '#3A5BFF',
      dotColor: '#3A5BFF'
    },
    {
      title: 'Contextual advertising',
      subtitle1: '<span class="white--text">will conduct a comprehensive audit</span>  of your current advertising campaigns and analyze your competitors\' advertising communications to <span class="white--text">provide you with recommendations for improvement.</span> ',
      subtitle2: 'We will develop a detailed structure of advertising campaigns, based on our experience in your industry and the results of conducted audits.',
      subtitle3: 'We will prepare high-quality advertising texts that attract attention and sell. We offer three types of reporting so that you are informed about the project details, our actions and the progress of the advertising campaign.',
      textColor: '#FF3939',
      dotColor: '#FF3939'
    },
    {
      title: 'Influencer marketing',
      subtitle1: '<span class="white--text">We use a comprehensive approach</span>  to the purchase and placement of advertising from bloggers. We plan campaigns to maximize the result of advertising, monitor execution and placement, and provide a detailed report and optimization plan after the campaign is complete.',
      subtitle2: '',
      subtitle3: '',
      textColor: '#A947FF',
      dotColor: '#A947FF'
    },
    {
      title: 'SMM [Instagram/Facebook]',
      subtitle1: '<span class="white--text">We will analyze your account</span> , previous strategy and competitors. Based on the analysis, we will develop a strategy for Instagram, Facebook, Telegram or LinkedIn, determine the Tone of Voice and prepare a shooting plan. We will develop a content plan and provide a report on the results at the end of the month.',
      subtitle2: '',
      subtitle3: '',
      textColor: '#FF3DF5',
      dotColor: '#FF3DF5'
    },
    {
      title: 'SEO',
      subtitle1: '<span class="white--text">We will conduct an audit of the structure and speed of the site</span> , measure the current positions in the ranking and, based on the received data, develop an improvement plan. In parallel, we will create a semantic core, write SEO-optimized texts, publish them on the website and blog. We will set up perelinking, create a purchase plan and buy links to improve the site\'s position in organic search.',
      subtitle2: '',
      subtitle3: '',
      textColor: '#FFE356',
      dotColor: '#FFE356'
    },
    {
      title: 'E-mail',
      subtitle1: '<span class="white--text">We will segment your customer base</span>, develop funnels to achieve marketing and business goals, create a visual concept and set up automation of mailings.',
      subtitle2: '',
      subtitle3: '',
      textColor: '#39FF71',
      dotColor: '#39FF71'
    }
  ];
  isOpen: boolean[] = [];

  handleOpen(index: number) {
    this.isOpen = this.isOpen.map((open, i) => i === index ? !open : false);
  }

  onSelectTool(tool: any ) {
    this.selectedTool = tool;
  }

  isSelected(tool: any) {
    return this.selectedTool === tool;
  }

  isSelectedSecond(index: number) {
    return this.isOpen[index];
  }

  workingDays = [
    "= 4 working days",
    "= 6 working days",
    "= 1 working day",
    "= 1 working day"
  ];

  currentStep = -1;
  private observer: IntersectionObserver | undefined;

  constructor(private cdr: ChangeDetectorRef, private el: ElementRef, @Inject(PLATFORM_ID) private platformId: Object) {
    this.updateVisibleCardsCount();
  }

  ngOnInit() {
    this.selectedTool = this.marketingTools[0];
    if (isPlatformBrowser(this.platformId)) {
      this.initializeObserver();
    }
    this.isOpen = new Array(this.marketingTools.length).fill(false);
  }


  private startObserver: IntersectionObserver | undefined;
  private endObserver: IntersectionObserver | undefined;
  private isScrollingInBlock: boolean = false;
  private isEndReached: boolean = false;

  initializeObserver() {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver не поддерживается этим браузером.');
      return;
    }

    // Наблюдатель для отслеживания начала блока
    this.startObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isScrollingInBlock = true;
          const sections = document.querySelectorAll('.digital--planList--card');
          const sectionIndex = Array.from(sections).indexOf(entry.target as HTMLElement);
          if (sectionIndex !== this.currentStep) {
            this.currentStep = sectionIndex;
            this.cdr.detectChanges();
          }
        } else {
          this.isScrollingInBlock = false;
          this.updateScrollBar(false); // Сброс прогресс-бара
        }
      });
    }, { threshold: [0.1] });

    // Наблюдатель для отслеживания конца блока
    this.endObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isEndReached = true;
        } else {
          this.isEndReached = false;
        }
      });
    }, { threshold: [0.9] });

    const digitalMain = document.querySelector('.digital--main');
    const sections = document.querySelectorAll('.digital--planList--card');

    if (digitalMain) {
      this.startObserver.observe(digitalMain);
      this.endObserver.observe(digitalMain);
      sections.forEach(section => {
        if (this.startObserver) {
          this.startObserver.observe(section);
        }
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.isScrollingInBlock && !this.isEndReached) {
      this.updateScrollBar();
    }
  }

  updateScrollBar(reset: boolean = false) {
    const digitalMain = document.querySelector('.digital--main') as HTMLElement;
    const scrollElement = document.querySelector('.digital--scroll') as HTMLElement;

    if (reset && scrollElement) {
      scrollElement.style.height = '0%';
      return;
    }

    if (digitalMain && scrollElement) {
      const rect = digitalMain.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollHeight = rect.height;
      const scrollTop = Math.max(0, windowHeight - rect.top);
      const scrollPosition = Math.min(scrollTop, scrollHeight);
      const percentage = (scrollPosition / scrollHeight) * 100;

      scrollElement.style.height = `${percentage}%`;
      scrollElement.style.backgroundColor = 'white';
    }
  }

  categories = [
    { name: 'All categories', value: 'all' },
    { name: 'E-commerce', value: 'ecommerce' },
    { name: 'Insta-Shop', value: 'instashop' },
    { name: 'Real estate', value: 'realestate' },
    { name: 'Educational products', value: 'education' },
    { name: 'B2C lead generation', value: 'b2c' },
    { name: 'B2B services', value: 'b2b' },
    { name: 'Medicine', value: 'medicine' },
    { name: 'Events', value: 'events' }
  ];



  cards = [
    { logo: 'assets/images/categories2_1.png', name: 'FashionEra', term: '', termQuantity: '', budget: 'Budget', price: '$16 800', sales: 'Sales', salesQuantity: '710 pcs.', roas: 'ROAS', saleAmount: '', salesAmountQuantity: '',roasQuantity: '850%', category: 'ecommerce' },
    { logo: 'assets/images/categories2_2.png', name: 'EcoWear', term: '', termQuantity: '', budget: 'Budget', price: '$12 000', sales: 'Sales', salesQuantity: '3,750 pcs.', roas: 'ROAS', saleAmount: '', salesAmountQuantity: '',roasQuantity: '2500%', category: 'ecommerce' },
    { logo: 'assets/images/categories2_3.png', name: 'PureSkin', term: '', termQuantity: '', budget: 'Budget', price: '$14.5 trn', sales: 'Sales', salesQuantity: '5,500 pcs.', roas: 'ROAS',saleAmount: '', salesAmountQuantity: '', roasQuantity: '780%', category: 'ecommerce' },
    { logo: 'assets/images/categories2_4.png', name: 'FoodieDelight', term: '', termQuantity: '', budget: 'Budget', price: '$12.1 trn', sales: 'Sales', salesQuantity: '4 200 pcs.', roas: 'ROAS', saleAmount: '', salesAmountQuantity: '',roasQuantity: '460%', category: 'ecommerce' },
    { logo: 'assets/images/categories2_5.png', name: 'ActiveLife', term: '', termQuantity: '', budget: 'Budget', price: '$72,500', sales: 'Sales', salesQuantity: '13,000 pcs.', roas: 'ROAS', saleAmount: '', salesAmountQuantity: '',roasQuantity: '950%', category: 'ecommerce' },
    { logo: 'assets/images/categories2_6.png', name: 'LuxStyle', term: '', termQuantity: '', budget: 'Budget', price: '$4.35 trn', sales: 'Sales', salesQuantity: '1,350 pcs.', roas: 'ROAS', saleAmount: '', salesAmountQuantity: '', roasQuantity: '750%', category: 'ecommerce' },
    { logo: 'assets/images/categories2_7.png', name: 'WellnessPro', term: 'Term', termQuantity: '2 months', budget: 'Budget', price: '$8.7 trn', sales: 'Sales', salesQuantity: '3,500 pcs.',saleAmount: 'Sale amount', salesAmountQuantity: '$116,000', roas: 'ROAS', roasQuantity: '1.350%', category: 'ecommerce' },
    { logo: 'assets/images/categories2_8.png', name: 'LuxStyle', term: 'Term', termQuantity: '3 months', budget: 'Budget', price: '$4.35 trn', sales: 'Sales', salesQuantity: '950 pcs.',saleAmount: 'Sale amount', salesAmountQuantity: '$27,800', roas: 'ROAS', roasQuantity: '750%', category: 'ecommerce' },
    { logo: 'assets/images/categories2_9.png', name: 'PatriotGear', term: 'Term', termQuantity: '3 months', budget: 'Budget', price: '$3.6 trn', sales: 'Sales', salesQuantity: '650 pcs.',saleAmount: 'Sale amount', salesAmountQuantity: '$86,000', leads :'Leads', leadsQuantity : '470', roas: 'ROAS', roasQuantity: '750%', category: 'ecommerce' },
    { logo: 'assets/images/categories2_10.png', name: 'ShopEasy', term: 'Term', termQuantity: '3 months', budget: 'Budget', price: '$3,600', sales: 'Sales', salesQuantity: '1,000 pcs.', sellingPrice : 'Selling price', sellingPriceQuantity: '$3.6', saleAmount: 'Sale amount', salesAmountQuantity: '$21,800', roas: 'ROAS', roasQuantity: '620%', category: 'ecommerce' },
    { logo: 'assets/images/categories2_11.png', name: 'SeaFresh', term: 'Term', termQuantity: '1 months', budget: 'Budget', price: '$4,300', sales: 'Sales', salesQuantity: '650 pcs.', sellingPrice : 'Selling price', sellingPriceQuantity: '$5', saleAmount: 'Sale amount', salesAmountQuantity: '$20,600', roas: 'ROAS', roasQuantity: '500%', category: 'ecommerce' },
    { logo: 'assets/images/categories2_12.png', name: 'BestChoice', term: 'Term', termQuantity: '3 months', budget: 'Budget', price: '$400', sales: 'Sales', salesQuantity: '1,250 pcs.', sellingPrice : 'Selling price', sellingPriceQuantity: '$3', saleAmount: 'Sale amount', salesAmountQuantity: '$27,900', roas: 'ROAS', roasQuantity: '650%', category: 'ecommerce' },
    { logo: 'assets/images/categories2_13.png', name: 'TechSolutions', term: 'Term', termQuantity: '3 months', budget: 'Budget', price: '$14,000', sales: 'Sales', salesQuantity: '1,500 pcs.', sellingPrice : 'Selling price', sellingPriceQuantity: '$9', saleAmount: 'Sale amount', salesAmountQuantity: '$1.8 mln', roas: 'ROAS', roasQuantity: '13,200%', category: 'ecommerce' },
    { logo: 'assets/images/categories3_1.png', name: 'StyleMania', term: '', termQuantity: '', budget: 'Budget', price: '$1,100', sales: 'Sales', salesQuantity: '130 pcs.',saleAmount: 'Sale amount', salesAmountQuantity: '$27,800',leads :'Leads', leadsQuantity : '560', roas: '', roasQuantity: '', category: 'instashop' },
    { logo: 'assets/images/categories3_2.png', name: 'EcoTrend', term: '', termQuantity: '', budget: 'Budget', price: '$11,500', sales: '', salesQuantity: '',saleAmount: '', salesAmountQuantity: '',leads :'Leads', leadsQuantity : '3,600', roas: 'ROAS', roasQuantity: '2,500%', category: 'instashop' },
    { logo: 'assets/images/categories4_1.png', name: 'Mountain View', term: '', termQuantity: '', budget: 'Budget', price: '$12,000', sales: 'Target programs', salesQuantity: '480 pcs.',saleAmount: 'Target program price', salesAmountQuantity: '$25',leads :'', leadsQuantity : '', roas: '', roasQuantity: '', poac: '', poacQuantity: '', category: 'realestate' },
    { logo: 'assets/images/categories5_1.png', name: 'FutureAcademy', term: '', termQuantity: '', budget: 'Budget', price: '$21,500', sales: '', salesQuantity: '',saleAmount: '', salesAmountQuantity: '',leads :'Leads', leadsQuantity : '1,900', roas: 'Price for ice', roasQuantity: '$11.3', poac: '', poacQuantity: '', category: 'education' },
    { logo: 'assets/images/categories5_2.png', name: 'TechLearn', term: '', termQuantity: '', budget: 'Budget', price: '$3.64 trn', sales: 'Sales', salesQuantity: '850 pcs.',saleAmount: '', salesAmountQuantity: '',leads :'', leadsQuantity : '', roas: 'Price for ice', roasQuantity: '$4,6', poac: '', poacQuantity: '', category: 'education' },
    { logo: 'assets/images/categories5_3.png', name: 'SmartEdu', term: '', termQuantity: '', budget: 'Budget', price: '$5,500', sales: 'Sales', salesQuantity: '185 pcs.',saleAmount: '', salesAmountQuantity: '',leads :'Leads', leadsQuantity : '1,500', roas: '', roasQuantity: '', poac: '', poacQuantity: '', category: 'education' },
    { logo: 'assets/images/categories5_4.png', name: 'DataMaster', term: 'Term', termQuantity: '3 months', budget: 'Budget', price: '$18,000', sales: 'Applications', salesQuantity: '4,200',saleAmount: 'Price per application', salesAmountQuantity: '$4.3',leads :'', leadsQuantity : '', roas: '', roasQuantity: '', poac: 'POAC', poacQuantity: '610%', category: 'education' },
    { logo: 'assets/images/categories6_1.png', name: 'CleanHome', term: '', termQuantity: '', budget: 'Budget', price: '$3.76 trn', sales: 'Sales', salesQuantity: '850 pcs.',saleAmount: 'Price for ice', salesAmountQuantity: '$4.6',leads :'', leadsQuantity : '', roas: '', roasQuantity: '', poac: '', poacQuantity: '', category: 'b2c' },
    { logo: 'assets/images/categories7_1.png', name: 'MarketPro', term: '', termQuantity: '', budget: 'Budget', price: '$12,000', sales: '', salesQuantity: '',saleAmount: '', salesAmountQuantity: '',leads :'Leads', leadsQuantity : '2,800', roas: 'Price for ice', roasQuantity: '$4.3', poac: '', poacQuantity: '', category: 'b2b' },
    { logo: 'assets/images/categories7_2.png', name: 'LeadMaster', term: '', termQuantity: '', budget: 'Budget', price: '$3.76 trn', sales: '', salesQuantity: '',saleAmount: 'Registrations', salesAmountQuantity: '4,500 pcs',leads :'', leadsQuantity : '', roas: 'ROAS', roasQuantity: '1.050%', poac: '', poacQuantity: '', category: 'b2b' },
    { logo: 'assets/images/categories7_3.png', name: 'TechPartners', term: 'Term', termQuantity: '3 months', budget: 'Budget', price: '$2.91 trn', sales: '', salesQuantity: '',saleAmount: '', salesAmountQuantity: '',leads :'Leads', leadsQuantity : '120', roas: 'Price for ice', roasQuantity: '$24', poac: '', poacQuantity: '', category: 'b2b' },
    { logo: 'assets/images/categories8_1.png', name: 'HealthCare Pro', term: 'Term', termQuantity: '3 months', budget: 'Budget', price: '$4,600', sales: 'Sales', salesQuantity: '1,800 pcs',saleAmount: 'Conversions', salesAmountQuantity: '1,800 pcs',leads :'Conversion price', leadsQuantity : '$2.5', roas: 'ROAS', roasQuantity: '2,500%', poac: '', poacQuantity: '', category: 'medicine' },
    { logo: 'assets/images/categories9_1.png', name: 'SpringFest', term: '', termQuantity: '', budget: 'Price', price: '$3,600', sales: '', salesQuantity: '',saleAmount: 'Price for ice', salesAmountQuantity: '$12.9',leads :'Leads', leadsQuantity : '280', roas: 'Ticket price', roasQuantity: '$220', poac: 'POAC', poacQuantity: '3,5', category: 'events' },
  ];

  filteredCards = this.cards;
  visibleCardsCount = 6;
  activeCategory: string = 'all';

  filterCards(categoryValue: string) {
    this.activeCategory = categoryValue;
    if (categoryValue === 'all') {
      this.filteredCards = this.cards;
    } else {
      this.filteredCards = this.cards.filter(card => card.category === categoryValue);
    }
    this.updateVisibleCardsCount();
  }

  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.filterCards(selectElement.value);
  }

  updateVisibleCardsCount() {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 992) {
        this.visibleCardsCount = this.cards.length;
      } else {
        this.visibleCardsCount = 6;
      }
    }
  }

  showMore() {
    this.visibleCardsCount += 6;
  }

}
