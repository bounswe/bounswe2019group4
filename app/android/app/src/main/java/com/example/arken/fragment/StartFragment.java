package com.example.arken.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.example.arken.R;

public class StartFragment extends Fragment implements View.OnClickListener {
    Button loginButton;
    Button signUpButton;
    Button guestButton;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_start, container, false);
        loginButton = view.findViewById(R.id.start_login_button);
        signUpButton = view.findViewById(R.id.start_signup_button);
        guestButton = view.findViewById(R.id.signup_guest_button);
        guestButton.setOnClickListener(this);
        loginButton.setOnClickListener(this);
        signUpButton.setOnClickListener(this);
        return view;
    }


    @Override
    public void onClick(View view) {
        if(view.getId() == R.id.start_login_button){
            Navigation.findNavController(view).navigate(R.id.action_startFragment_to_loginFragment);
        } else if(view.getId() == R.id.start_signup_button){
            Navigation.findNavController(view).navigate(R.id.action_startFragment_to_signupFragment);
        } else if (view.getId() == R.id.signup_guest_button) {
            Navigation.findNavController(view).navigate(R.id.action_startFragment_to_listEventFragment);
        }
    }
}
