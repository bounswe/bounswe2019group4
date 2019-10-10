package com.example.arken.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.arken.R;

public class StartFragment extends Fragment implements View.OnClickListener {
    Button loginButton;
    Button signUpButton;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_start, container, false);
        loginButton = view.findViewById(R.id.start_login_button);
        signUpButton = view.findViewById(R.id.start_signup_button);
        loginButton.setOnClickListener(this);
        signUpButton.setOnClickListener(this);
        return view;
    }


    @Override
    public void onClick(View view) {
        if(view.getId() == R.id.start_login_button){
            LoginFragment nextFrag= new LoginFragment();
            getActivity().getSupportFragmentManager().beginTransaction()
                    .add(R.id.root_layout, nextFrag, "findThisFragment")
                    .addToBackStack(null)
                    .commit();
        }
        else if(view.getId() == R.id.start_signup_button){
            SignupFragment nextFrag= new SignupFragment();
            getActivity().getSupportFragmentManager().beginTransaction()
                    .add(R.id.root_layout, nextFrag, "findThisFragment")
                    .addToBackStack(null)
                    .commit();
        }
    }
}
