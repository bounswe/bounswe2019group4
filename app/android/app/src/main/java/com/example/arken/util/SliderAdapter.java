package com.example.arken.util;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.viewpager.widget.PagerAdapter;

import com.example.arken.R;

public class SliderAdapter extends PagerAdapter {

    Context context;
    LayoutInflater layoutInflater;

    public SliderAdapter(Context context) {
        this.context = context;
    }

    public int[] slideImages = {
            R.drawable.slide_image_1,
            R.drawable.slide_image_2,
            R.drawable.slide_image_3,
            R.drawable.slide_image_5,
            R.drawable.slide_image_4
    };

    public String[] slide_descs = {

            "Welcome to an interactive trading platform with full of people who are interested in trading and investing in financial markets worldwide.",

            "Connect with other finance enthusiasts like you. Follow their portfolios, articles and interact with them to stay up to date.",

            "Invest in trading indices and currencies by becoming a Trader User. Not ready to invest? Stay as a Basic User and learn all about trading by using our platform.",

            "Find out what is happening in financial markets all around world. Search and read about economic events to invest wisely.",

           "Arkenstone has a native web and native mobile (Android) platform to make things easier for you. Earn wherever you go and whenever you want!"
    };

    @Override
    public int getCount() {
        return slideImages.length;
    }

    @Override
    public boolean isViewFromObject(@NonNull View view, @NonNull Object object) {
        return view == object;
    }

    @NonNull
    @Override
    public Object instantiateItem(@NonNull ViewGroup container, int position) {

        layoutInflater = (LayoutInflater) context.getSystemService(context.LAYOUT_INFLATER_SERVICE);
        View view = layoutInflater.inflate(R.layout.slide_layout, container, false);

        ImageView slideImage = view.findViewById(R.id.slide_image);
        TextView slideTextView = view.findViewById(R.id.slide_textView);

        slideImage.setImageResource(slideImages[position]);
        slideTextView.setText(slide_descs[position]);

        container.addView(view);

        return view;
    }

    @Override
    public void destroyItem(@NonNull ViewGroup container, int position, @NonNull Object object) {

        container.removeView((ConstraintLayout)object);
    }
}
