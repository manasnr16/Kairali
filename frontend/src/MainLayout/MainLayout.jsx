
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from '../Components/Navber';
import TopBar from '../Components/TopBar';
import HeroSlider from '../Components/HeroSlider';
import { Outlet, useLocation } from 'react-router';
import Footer from '../Components/Footer';

const MainLayout = () => {
    const location = useLocation();

    // Initialize AOS once for the whole app instead of per-section, so every
    // page shares one set of trigger offsets.
    useEffect(() => {
        AOS.init({
            duration: 800,
            offset: 100,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

    // Recalculate trigger offsets whenever the route changes or the page's
    // content/images finish loading — without this, AOS keeps using the
    // offsets it measured on first mount, so once images (hero slider,
    // testimonial photos, etc.) load and push content down, the animations
    // fire out of sync with what's actually on screen.
    useEffect(() => {
        AOS.refreshHard();

        const handleLoad = () => AOS.refreshHard();
        window.addEventListener('load', handleLoad);

        const images = Array.from(document.querySelectorAll('img'));
        images.forEach((img) => {
            if (!img.complete) {
                img.addEventListener('load', handleLoad, { once: true });
            }
        });

        return () => {
            window.removeEventListener('load', handleLoad);
            images.forEach((img) => img.removeEventListener('load', handleLoad));
        };
    }, [location.pathname]);

    return (
        <div>
            {/* <TopBar></TopBar> */}
            <Navbar></Navbar>
            <div >
                <Outlet></Outlet>
            </div>

            <Footer></Footer>
        </div>
    );
};

export default MainLayout;