#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"ConnectTransferDemoApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  RCTBundleURLProvider *bundleProvider = [RCTBundleURLProvider sharedSettings];
  bundleProvider.jsLocation = @"127.0.0.1";
  NSURL *devBundleURL = [bundleProvider jsBundleURLForBundleRoot:@"index"];
  if (devBundleURL != nil) {
    return devBundleURL;
  }

  // Fallback to default Metro URL when provider settings are unavailable.
  return [NSURL URLWithString:@"http://127.0.0.1:8081/index.bundle?platform=ios&dev=true&minify=false"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
