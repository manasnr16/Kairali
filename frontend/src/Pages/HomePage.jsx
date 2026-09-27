
import React from 'react';
import HeroSlider from '../Components/HeroSlider';
import PremiumMembers from '../Components/PremiumMembers';
import OurServices from '../Components/OurSevices';
import HowItWorks from '../Components/HowItWorks';
import WelcomeSection from '../Components/WelcomeSection';
import TrustedSection from '../Components/TrustedSection';
import CoupleTestimonials from '../Components/CoupleTestimonials';
import RecentCouplesSlider from '../Components/RecentCouplesSlider';


const HomePage = () => {
    return (
        <div>
            <HeroSlider/>
            <WelcomeSection></WelcomeSection>
            <OurServices/>
            <PremiumMembers/>
            <HowItWorks></HowItWorks>
            <TrustedSection></TrustedSection>
            <RecentCouplesSlider></RecentCouplesSlider>
            <CoupleTestimonials></CoupleTestimonials>
        </div>
    );
};

export default HomePage;