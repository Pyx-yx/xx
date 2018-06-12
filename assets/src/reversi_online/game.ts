module game {
	export class TClass {
	
		private static s_instance: TClass = null;
		
		private platformInstance: TClass;
		public static getInstance(): TClass {
			if(!TClass.s_instance) {
				TClass.s_instance = new TClass(); 
				TClass.s_instance.init(); 
			} 
			return TClass.s_instance; 
		}
		
		public constructor() {
 
            if(TClass.s_instance) {
                throw new egret.error("TClass is a singleton class.");
            }
            this.init();
		}

		private init(){
            window['platformInstance'] = TClass.s_instance; 
		}
		
		public jsCallFun(_arg:string):void
		{
            console.log(_arg);
        }
	}
}